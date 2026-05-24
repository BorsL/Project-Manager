import { api } from '@convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Archive, CheckCircle2, MapPlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import type { Project } from '@/entities/project/model';
import type { Task } from '@/entities/task/model';
import { isConvexConfigured, useConfiguredMutation, useConfiguredQuery } from '@/shared/lib/convex';
import { formatDate, getErrorMessage } from '@/shared/lib/format';
import type { TaskStage } from '@/shared/model/domain';
import { stageMeta, taskStages } from '@/shared/model/domain';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Screen,
  ScreenHeader,
  SegmentedTabs,
} from '@/shared/ui';

type TaskContext = {
  task: Task;
  project: Project | null;
};

const stageOptions = taskStages.map((stage) => ({
  label: stageMeta[stage].shortLabel,
  value: stage,
}));

export function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const context = useConfiguredQuery(api.tasks.get, { taskId }) as TaskContext | null | undefined;
  const updateTask = useConfiguredMutation(api.tasks.update);
  const markDone = useConfiguredMutation(api.tasks.markDone);
  const changeStage = useConfiguredMutation(api.tasks.changeStage);
  const archiveTask = useConfiguredMutation(api.tasks.archive);
  const addTaskToRoadmap = useConfiguredMutation(api.roadmap.addTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<TaskStage>('designing');
  const [saving, setSaving] = useState(false);

  const task = context?.task;
  const project = context?.project;

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? '');
    setStage((task.stage as TaskStage | undefined) ?? 'designing');
  }, [task]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateTask({
        taskId,
        title,
        description: description || undefined,
        stage: task?.scope === 'project' ? stage : undefined,
      });
      if (task?.scope === 'project') {
        await changeStage({ taskId, stage });
      }
      Alert.alert('Saved', 'Task changes are saved.');
    } catch (error) {
      Alert.alert('Task was not updated', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDone() {
    if (!task) {
      return;
    }

    try {
      await markDone({ taskId, done: !task.doneAt });
    } catch (error) {
      Alert.alert('Task was not updated', getErrorMessage(error));
    }
  }

  async function handleArchive() {
    try {
      await archiveTask({ taskId });
      if (project) {
        router.replace(`/projects/${project._id}`);
      } else {
        router.replace('/todos');
      }
    } catch (error) {
      Alert.alert('Task was not archived', getErrorMessage(error));
    }
  }

  async function handleAddToRoadmap() {
    try {
      await addTaskToRoadmap({ taskId });
      Alert.alert('Added to roadmap', 'This task is now in the roadmap.');
    } catch (error) {
      Alert.alert('Roadmap update failed', getErrorMessage(error));
    }
  }

  if (!isConvexConfigured) {
    return (
      <Screen>
        <ScreenHeader title="Task" />
        <EmptyState body="Set Convex URL" title="Convex" />
      </Screen>
    );
  }

  if (context === undefined) {
    return (
      <Screen>
        <Card>
          <Text className="text-base text-muted">Loading task...</Text>
        </Card>
      </Screen>
    );
  }

  if (!task) {
    return (
      <Screen>
        <EmptyState title="Task not found" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow={task.scope === 'project' ? 'Project task' : 'Todo'}
        title={title || 'Task'}
      />
      <Card className="gap-4">
        <View className="flex-row flex-wrap gap-2">
          {task.scope === 'project' && task.stage ? (
            <Badge
              backgroundColor={stageMeta[task.stage as TaskStage].backgroundColor}
              color={stageMeta[task.stage as TaskStage].color}
              label={stageMeta[task.stage as TaskStage].label}
            />
          ) : null}
          {task.doneAt ? <Badge backgroundColor="#DCEFE3" color="#2F7D50" label="Done" /> : null}
        </View>
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input label="Notes" multiline value={description} onChangeText={setDescription} />
        {task.scope === 'project' ? (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-ink">Stage</Text>
            <SegmentedTabs options={stageOptions} value={stage} onChange={setStage} />
          </View>
        ) : null}
        <Text className="text-sm text-muted">Updated {formatDate(task.updatedAt)}</Text>
        <View className="gap-3">
          <Button
            disabled={!title.trim()}
            label="Save Changes"
            loading={saving}
            onPress={handleSave}
          />
          <Button
            icon={CheckCircle2}
            label={task.doneAt ? 'Reopen Task' : 'Mark Done'}
            variant="secondary"
            onPress={handleDone}
          />
          <Button
            icon={MapPlus}
            label="Add To Roadmap"
            variant="secondary"
            onPress={handleAddToRoadmap}
          />
          <Button icon={Archive} label="Archive Task" variant="danger" onPress={handleArchive} />
        </View>
      </Card>
    </Screen>
  );
}
