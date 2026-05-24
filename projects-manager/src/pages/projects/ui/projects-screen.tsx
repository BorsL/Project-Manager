import { api } from '@convex/_generated/api';
import { router } from 'expo-router';
import { FolderKanban, MapPlus, Plus } from 'lucide-react-native';
import { Alert, Text, View } from 'react-native';

import type { Project } from '@/entities/project/model';
import { isConvexConfigured, useConfiguredMutation, useConfiguredQuery } from '@/shared/lib/convex';
import { formatDate, getErrorMessage } from '@/shared/lib/format';
import type { TaskStage } from '@/shared/model/domain';
import { stageMeta } from '@/shared/model/domain';
import { Button, Card, EmptyState, Screen, ScreenHeader } from '@/shared/ui';
import { WorkItemCard } from '@/widgets/work-list/work-item-card';

type ProjectListItem = Project & {
  currentTask: {
    _id: string;
    stage: TaskStage;
    title: string;
    updatedAt: number;
  } | null;
  stageCounts: Record<TaskStage, number>;
};

export function ProjectsScreen() {
  const projects = useConfiguredQuery(api.projects.listWithCurrentWork, {}) as
    | ProjectListItem[]
    | undefined;
  const addProjectToRoadmap = useConfiguredMutation(api.roadmap.addProject);

  async function handleAddToRoadmap(project: Project) {
    try {
      await addProjectToRoadmap({ projectId: project._id });
      Alert.alert('Added to roadmap', `${project.title} is now on the roadmap.`);
    } catch (error) {
      Alert.alert('Roadmap update failed', getErrorMessage(error));
    }
  }

  if (!isConvexConfigured) {
    return (
      <Screen>
        <ScreenHeader
          actionIcon={Plus}
          actionLabel="New Project"
          title="Projects"
          onAction={() => router.push('/projects/new')}
        />
        <EmptyState body="Set Convex URL" icon={FolderKanban} title="Convex" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        actionIcon={Plus}
        actionLabel="New Project"
        title="Projects"
        onAction={() => router.push('/projects/new')}
      />

      {projects === undefined ? (
        <Card>
          <Text className="text-base text-muted">Loading projects...</Text>
        </Card>
      ) : projects.length === 0 ? (
        <EmptyState
          actionLabel="Create"
          icon={FolderKanban}
          title="No projects"
          onAction={() => router.push('/projects/new')}
        />
      ) : (
        <View className="gap-3">
          {projects.map((project) => {
            const currentTask = project.currentTask;
            const currentStage = currentTask?.stage;
            const currentMeta = currentTask
              ? `Updated ${formatDate(currentTask.updatedAt)}`
              : `Opened ${formatDate(project.lastOpenedAt)}`;

            return (
              <WorkItemCard
                detail={
                  <View className="gap-2">
                    <Text className="text-xs font-semibold uppercase text-muted">Current</Text>
                    <Text className="text-sm font-semibold leading-5 text-ink" numberOfLines={2}>
                      {currentTask?.title ?? 'None'}
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                      <Text className="text-xs font-semibold text-muted">
                        Design {project.stageCounts.designing}
                      </Text>
                      <Text className="text-xs font-semibold text-muted">
                        Build {project.stageCounts.building}
                      </Text>
                      <Text className="text-xs font-semibold text-muted">
                        Test {project.stageCounts.testing}
                      </Text>
                    </View>
                  </View>
                }
                key={project._id}
                kind="Project"
                meta={currentMeta}
                statusBackgroundColor={
                  currentStage ? stageMeta[currentStage].backgroundColor : '#E7E2FA'
                }
                statusColor={currentStage ? stageMeta[currentStage].color : '#6F5EBA'}
                statusLabel={currentStage ? stageMeta[currentStage].shortLabel : 'Board'}
                title={project.title}
                onPress={() => router.push(`/projects/${project._id}`)}
              >
                {currentTask ? (
                  <Button
                    className="min-w-32 flex-1"
                    label="Resume"
                    onPress={() => router.push(`/tasks/${currentTask._id}`)}
                  />
                ) : null}
                <Button
                  className="min-w-32 flex-1"
                  label="Board"
                  onPress={() => router.push(`/projects/${project._id}`)}
                />
                <Button
                  className="min-w-32 flex-1"
                  icon={MapPlus}
                  label="Roadmap"
                  variant="secondary"
                  onPress={() => handleAddToRoadmap(project)}
                />
              </WorkItemCard>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
