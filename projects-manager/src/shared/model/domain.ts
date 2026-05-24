export const taskStages = ['designing', 'building', 'testing', 'completed'] as const;
export type TaskStage = (typeof taskStages)[number];

export const taskScopes = ['todo', 'project'] as const;
export type TaskScope = (typeof taskScopes)[number];

export const roadmapStatuses = ['planned', 'done', 'skipped'] as const;
export type RoadmapStatus = (typeof roadmapStatuses)[number];

export const stageMeta: Record<
  TaskStage,
  {
    label: string;
    shortLabel: string;
    color: string;
    backgroundColor: string;
  }
> = {
  designing: {
    label: 'Designing',
    shortLabel: 'Design',
    color: '#256D85',
    backgroundColor: '#D9EDF2',
  },
  building: {
    label: 'Building',
    shortLabel: 'Build',
    color: '#6F5EBA',
    backgroundColor: '#E7E2FA',
  },
  testing: {
    label: 'Testing',
    shortLabel: 'Test',
    color: '#A35F18',
    backgroundColor: '#F6E3C7',
  },
  completed: {
    label: 'Completed',
    shortLabel: 'Done',
    color: '#2F7D50',
    backgroundColor: '#DCEFE3',
  },
};

export const roadmapStatusMeta: Record<
  RoadmapStatus,
  {
    label: string;
    color: string;
    backgroundColor: string;
  }
> = {
  planned: {
    label: 'Planned',
    color: '#256D85',
    backgroundColor: '#D9EDF2',
  },
  done: {
    label: 'Done',
    color: '#2F7D50',
    backgroundColor: '#DCEFE3',
  },
  skipped: {
    label: 'Skipped',
    color: '#667067',
    backgroundColor: '#E8E2D6',
  },
};
