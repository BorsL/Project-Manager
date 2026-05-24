import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const taskStageValidator = v.union(
  v.literal('designing'),
  v.literal('building'),
  v.literal('testing'),
  v.literal('completed'),
);

export const taskScopeValidator = v.union(v.literal('todo'), v.literal('project'));

export const roadmapKindValidator = v.union(
  v.literal('note'),
  v.literal('task'),
  v.literal('project'),
);

export const roadmapStatusValidator = v.union(
  v.literal('planned'),
  v.literal('done'),
  v.literal('skipped'),
);

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastOpenedAt: v.number(),
    archivedAt: v.optional(v.number()),
  }).index('by_archived', ['archivedAt']),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    scope: taskScopeValidator,
    projectId: v.optional(v.id('projects')),
    stage: v.optional(taskStageValidator),
    priority: v.optional(v.union(v.literal('low'), v.literal('normal'), v.literal('high'))),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    doneAt: v.optional(v.number()),
    archivedAt: v.optional(v.number()),
  })
    .index('by_scope', ['scope'])
    .index('by_project', ['projectId'])
    .index('by_project_stage', ['projectId', 'stage']),

  roadmapItems: defineTable({
    title: v.string(),
    notes: v.optional(v.string()),
    kind: roadmapKindValidator,
    taskId: v.optional(v.id('tasks')),
    projectId: v.optional(v.id('projects')),
    order: v.number(),
    status: roadmapStatusValidator,
    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
  }).index('by_archived', ['archivedAt']),
});
