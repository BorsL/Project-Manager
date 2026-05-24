import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const taskStages = ['designing', 'building', 'testing', 'completed'] as const;

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

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_archived', (q) => q.eq('archivedAt', undefined))
      .collect();

    return projects.sort((left, right) => right.lastOpenedAt - left.lastOpenedAt);
  },
});

export const listWithCurrentWork = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_archived', (q) => q.eq('archivedAt', undefined))
      .collect();

    const projectsWithWork = await Promise.all(
      projects.map(async (project) => {
        const tasks = await ctx.db
          .query('tasks')
          .withIndex('by_project', (q) => q.eq('projectId', project._id))
          .collect();

        const visibleTasks = tasks.filter((task) => !task.archivedAt);
        const stageCounts = {
          designing: 0,
          building: 0,
          testing: 0,
          completed: 0,
        };
        for (const task of visibleTasks) {
          if (task.stage && taskStages.includes(task.stage)) {
            stageCounts[task.stage] += 1;
          }
        }
        const currentTask = visibleTasks
          .filter((task) => task.stage && task.stage !== 'completed' && !task.doneAt)
          .sort((left, right) => right.updatedAt - left.updatedAt)[0];

        return {
          ...project,
          currentTask: currentTask
            ? {
                _id: currentTask._id,
                stage: currentTask.stage ?? 'designing',
                title: currentTask.title,
                updatedAt: currentTask.updatedAt,
              }
            : null,
          stageCounts,
        };
      }),
    );

    return projectsWithWork.sort((left, right) => right.lastOpenedAt - left.lastOpenedAt);
  },
});

export const get = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || project.archivedAt) {
      return null;
    }

    return project;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = now();

    return await ctx.db.insert('projects', {
      title: requireText(args.title, 'Project title'),
      description: args.description?.trim(),
      color: args.color,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastOpenedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    projectId: v.id('projects'),
    title: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || project.archivedAt) {
      throw new Error('Project not found.');
    }

    await ctx.db.patch(args.projectId, {
      title: requireText(args.title, 'Project title'),
      description: args.description?.trim(),
      color: args.color,
      updatedAt: now(),
    });
  },
});

export const touch = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || project.archivedAt) {
      return;
    }

    await ctx.db.patch(args.projectId, {
      lastOpenedAt: now(),
      updatedAt: now(),
    });
  },
});

export const archive = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || project.archivedAt) {
      return;
    }

    const timestamp = now();
    await ctx.db.patch(args.projectId, {
      archivedAt: timestamp,
      updatedAt: timestamp,
    });

    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    await Promise.all(
      tasks
        .filter((task) => !task.archivedAt)
        .map((task) =>
          ctx.db.patch(task._id, {
            archivedAt: timestamp,
            updatedAt: timestamp,
          }),
        ),
    );
  },
});
