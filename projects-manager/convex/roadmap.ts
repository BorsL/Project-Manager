import { v } from 'convex/values';

import type { MutationCtx } from './_generated/server';
import { mutation, query } from './_generated/server';
import { roadmapStatusValidator } from './schema';

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

async function nextOrder(ctx: MutationCtx) {
  const items = await ctx.db
    .query('roadmapItems')
    .withIndex('by_archived', (q) => q.eq('archivedAt', undefined))
    .collect();

  const maxOrder = items.reduce((max, item) => Math.max(max, item.order), 0);
  return maxOrder + 1000;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query('roadmapItems')
      .withIndex('by_archived', (q) => q.eq('archivedAt', undefined))
      .collect();

    return items.sort((left, right) => left.order - right.order);
  },
});

export const addNote = mutation({
  args: {
    title: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = now();

    return await ctx.db.insert('roadmapItems', {
      title: requireText(args.title, 'Roadmap title'),
      notes: args.notes?.trim(),
      kind: 'note',
      order: await nextOrder(ctx),
      status: 'planned',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const addTask = mutation({
  args: {
    taskId: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || task.archivedAt) {
      throw new Error('Task not found.');
    }

    const timestamp = now();

    return await ctx.db.insert('roadmapItems', {
      title: task.title,
      notes: task.description,
      kind: 'task',
      taskId: task._id,
      projectId: task.projectId,
      order: await nextOrder(ctx),
      status: task.doneAt ? 'done' : 'planned',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const addProject = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || project.archivedAt) {
      throw new Error('Project not found.');
    }

    const timestamp = now();

    return await ctx.db.insert('roadmapItems', {
      title: project.title,
      notes: project.description,
      kind: 'project',
      projectId: project._id,
      order: await nextOrder(ctx),
      status: 'planned',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const move = mutation({
  args: {
    itemId: v.id('roadmapItems'),
    direction: v.union(v.literal('up'), v.literal('down')),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item || item.archivedAt) {
      return;
    }

    const items = (
      await ctx.db
        .query('roadmapItems')
        .withIndex('by_archived', (q) => q.eq('archivedAt', undefined))
        .collect()
    ).sort((left, right) => left.order - right.order);

    const index = items.findIndex((candidate) => candidate._id === args.itemId);
    const targetIndex = args.direction === 'up' ? index - 1 : index + 1;
    const target = items[targetIndex];

    if (!target) {
      return;
    }

    await Promise.all([
      ctx.db.patch(item._id, {
        order: target.order,
        updatedAt: now(),
      }),
      ctx.db.patch(target._id, {
        order: item.order,
        updatedAt: now(),
      }),
    ]);
  },
});

export const reorder = mutation({
  args: {
    itemIds: v.array(v.id('roadmapItems')),
  },
  handler: async (ctx, args) => {
    const timestamp = now();
    const items = await Promise.all(args.itemIds.map((itemId) => ctx.db.get(itemId)));

    await Promise.all(
      items.map((item, index) => {
        if (!item || item.archivedAt) {
          throw new Error('Roadmap order contains an invalid item.');
        }

        return ctx.db.patch(item._id, {
          order: (index + 1) * 1000,
          updatedAt: timestamp,
        });
      }),
    );
  },
});

export const setPosition = mutation({
  args: {
    itemId: v.id('roadmapItems'),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const items = (
      await ctx.db
        .query('roadmapItems')
        .withIndex('by_archived', (q) => q.eq('archivedAt', undefined))
        .collect()
    ).sort((left, right) => left.order - right.order);

    const fromIndex = items.findIndex((item) => item._id === args.itemId);
    if (fromIndex === -1) {
      return;
    }

    const [item] = items.splice(fromIndex, 1);
    const targetIndex = Math.min(Math.max(Math.round(args.position) - 1, 0), items.length);
    items.splice(targetIndex, 0, item);

    const timestamp = now();
    await Promise.all(
      items.map((roadmapItem, index) =>
        ctx.db.patch(roadmapItem._id, {
          order: (index + 1) * 1000,
          updatedAt: timestamp,
        }),
      ),
    );
  },
});

export const markStatus = mutation({
  args: {
    itemId: v.id('roadmapItems'),
    status: roadmapStatusValidator,
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item || item.archivedAt) {
      return;
    }

    await ctx.db.patch(args.itemId, {
      status: args.status,
      updatedAt: now(),
    });
  },
});

export const archive = mutation({
  args: {
    itemId: v.id('roadmapItems'),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item || item.archivedAt) {
      return;
    }

    await ctx.db.patch(args.itemId, {
      archivedAt: now(),
      updatedAt: now(),
    });
  },
});
