import { v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import { mutation, query } from './_generated/server';
import { taskStageValidator } from './schema';

function now() {
  return Date.now();
}

function requireText(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }
  return trimmed;
}

function compareTaskOrder(
  left: { order?: number; createdAt: number },
  right: { order?: number; createdAt: number },
) {
  return (left.order ?? left.createdAt) - (right.order ?? right.createdAt);
}

async function nextProjectTaskOrder(
  ctx: MutationCtx,
  projectId: Id<'projects'>,
  stage: 'designing' | 'building' | 'testing' | 'completed',
) {
  const tasks = await ctx.db
    .query('tasks')
    .withIndex('by_project_stage', (q) => q.eq('projectId', projectId).eq('stage', stage))
    .collect();

  const maxOrder = tasks
    .filter((task) => !task.archivedAt)
    .reduce((max, task) => Math.max(max, task.order ?? task.createdAt), 0);

  return maxOrder + 1000;
}

export const listTodos = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_scope', (q) => q.eq('scope', 'todo'))
      .collect();

    return tasks
      .filter((task) => !task.archivedAt)
      .sort((left, right) => {
        if (Boolean(left.doneAt) !== Boolean(right.doneAt)) {
          return left.doneAt ? 1 : -1;
        }
        return compareTaskOrder(left, right);
      });
  },
});

export const listByProject = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return tasks
      .filter((task) => !task.archivedAt)
      .sort((left, right) => compareTaskOrder(left, right));
  },
});

export const get = query({
  args: {
    taskId: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || task.archivedAt) {
      return null;
    }

    const project = task.projectId ? await ctx.db.get(task.projectId) : null;

    return {
      task,
      project: project && !project.archivedAt ? project : null,
    };
  },
});

export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = now();

    return await ctx.db.insert('tasks', {
      title: requireText(args.title, 'Todo title'),
      description: args.description?.trim(),
      scope: 'todo',
      priority: 'normal',
      order: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const createProjectTask = mutation({
  args: {
    projectId: v.id('projects'),
    title: v.string(),
    description: v.optional(v.string()),
    stage: v.optional(taskStageValidator),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || project.archivedAt) {
      throw new Error('Project not found.');
    }

    const timestamp = now();
    const stage = args.stage ?? 'designing';

    return await ctx.db.insert('tasks', {
      title: requireText(args.title, 'Task title'),
      description: args.description?.trim(),
      scope: 'project',
      projectId: args.projectId,
      stage,
      priority: 'normal',
      order: await nextProjectTaskOrder(ctx, args.projectId, stage),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    taskId: v.id('tasks'),
    title: v.string(),
    description: v.optional(v.string()),
    stage: v.optional(taskStageValidator),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || task.archivedAt) {
      throw new Error('Task not found.');
    }

    const nextStage =
      task.scope === 'project' ? (args.stage ?? task.stage ?? 'designing') : undefined;
    await ctx.db.patch(args.taskId, {
      title: requireText(args.title, 'Task title'),
      description: args.description?.trim(),
      stage: nextStage,
      order:
        task.scope === 'project' && task.projectId && nextStage && nextStage !== task.stage
          ? await nextProjectTaskOrder(ctx, task.projectId, nextStage)
          : task.order,
      updatedAt: now(),
    });
  },
});

export const changeStage = mutation({
  args: {
    taskId: v.id('tasks'),
    stage: taskStageValidator,
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || task.archivedAt || task.scope !== 'project') {
      throw new Error('Project task not found.');
    }

    const timestamp = now();
    await ctx.db.patch(args.taskId, {
      stage: args.stage,
      order:
        task.projectId && task.stage !== args.stage
          ? await nextProjectTaskOrder(ctx, task.projectId, args.stage)
          : task.order,
      doneAt: args.stage === 'completed' ? (task.doneAt ?? timestamp) : undefined,
      updatedAt: timestamp,
    });
  },
});

export const markDone = mutation({
  args: {
    taskId: v.id('tasks'),
    done: v.boolean(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || task.archivedAt) {
      throw new Error('Task not found.');
    }

    const timestamp = now();
    const nextStage = task.scope === 'project' && args.done ? 'completed' : task.stage;
    await ctx.db.patch(args.taskId, {
      doneAt: args.done ? timestamp : undefined,
      stage: nextStage,
      order:
        task.scope === 'project' &&
        task.projectId &&
        nextStage === 'completed' &&
        task.stage !== 'completed'
          ? await nextProjectTaskOrder(ctx, task.projectId, nextStage)
          : task.order,
      updatedAt: timestamp,
    });
  },
});

export const archive = mutation({
  args: {
    taskId: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || task.archivedAt) {
      return;
    }

    await ctx.db.patch(args.taskId, {
      archivedAt: now(),
      updatedAt: now(),
    });
  },
});

export const reorderProjectStage = mutation({
  args: {
    projectId: v.id('projects'),
    stage: taskStageValidator,
    taskIds: v.array(v.id('tasks')),
  },
  handler: async (ctx, args) => {
    const timestamp = now();
    const tasks = await Promise.all(args.taskIds.map((taskId) => ctx.db.get(taskId)));

    await Promise.all(
      tasks.map((task, index) => {
        if (
          !task ||
          task.archivedAt ||
          task.scope !== 'project' ||
          task.projectId !== args.projectId ||
          task.stage !== args.stage
        ) {
          throw new Error('Task order contains an invalid project task.');
        }

        return ctx.db.patch(task._id, {
          order: (index + 1) * 1000,
          updatedAt: timestamp,
        });
      }),
    );
  },
});
