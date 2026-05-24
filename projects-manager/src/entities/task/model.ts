import type { Doc, Id } from '@convex/_generated/dataModel';
import type { TaskScope, TaskStage } from '@/shared/model/domain';

export type Task = Doc<'tasks'>;
export type TaskId = Id<'tasks'>;
export type ProjectId = Id<'projects'>;

export type TaskDraft = {
  title: string;
  description?: string;
  scope: TaskScope;
  stage?: TaskStage;
};
