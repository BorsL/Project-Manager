import { api } from '@convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Archive, Edit3, FolderCheck, Plus, RotateCcw, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import type { Project } from '@/entities/project/model';
import type { Task } from '@/entities/task/model';
import { isConvexConfigured, useConfiguredMutation, useConfiguredQuery } from '@/shared/lib/convex';
import { getErrorMessage } from '@/shared/lib/format';
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
  SheetDialog,
} from '@/shared/ui';
import { StageColumn } from '@/widgets/project-board/stage-column';

const activeTaskStages: TaskStage[] = ['designing', 'building', 'testing'];

const stageOptions = activeTaskStages.map((stage) => ({
  label: stageMeta[stage].shortLabel,
  value: stage,
}));

export function ProjectBoardScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { height, width } = useWindowDimensions();
  const isWideBoard = width >= 900;
  const compactBoard = !isWideBoard;
  const laneGap = compactBoard ? 8 : 12;
  const visibleLaneCount = activeTaskStages.length;
  const availableBoardWidth = Math.max(width - (compactBoard ? 48 : 56), 0);
  const laneWidth = Math.max(
    compactBoard ? 104 : 180,
    Math.floor((availableBoardWidth - laneGap * (visibleLaneCount - 1)) / visibleLaneCount),
  );
  const doneListMaxHeight = Math.min(420, height * 0.48);
  const [selectedStage, setSelectedStage] = useState<TaskStage>('designing');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showDoneTasks, setShowDoneTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  const project = useConfiguredQuery(api.projects.get, { projectId }) as Project | null | undefined;
  const tasks = useConfiguredQuery(api.tasks.listByProject, { projectId }) as Task[] | undefined;
  const touchProject = useConfiguredMutation(api.projects.touch);
  const createTask = useConfiguredMutation(api.tasks.createProjectTask);
  const changeStage = useConfiguredMutation(api.tasks.changeStage);
  const archiveTask = useConfiguredMutation(api.tasks.archive);
  const reorderStage = useConfiguredMutation(api.tasks.reorderProjectStage);

  useEffect(() => {
    if (!isConvexConfigured || !projectId) {
      return;
    }

    void touchProject({ projectId }).catch(() => undefined);
  }, [projectId, touchProject]);

  const tasksByStage = useMemo(() => {
    return taskStages.reduce<Record<TaskStage, Task[]>>(
      (accumulator, stage) => {
        accumulator[stage] = (tasks ?? []).filter((task) => task.stage === stage);
        return accumulator;
      },
      {
        designing: [],
        building: [],
        testing: [],
        completed: [],
      },
    );
  }, [tasks]);

  const currentTask = useMemo(() => {
    return [...(tasks ?? [])]
      .filter((task) => task.stage && task.stage !== 'completed' && !task.doneAt)
      .sort((left, right) => right.updatedAt - left.updatedAt)[0];
  }, [tasks]);
  const doneTasks = tasksByStage.completed;

  async function handleCreateTask() {
    setSavingTask(true);
    try {
      await createTask({
        projectId,
        title: newTaskTitle,
        description: newTaskDescription || undefined,
        stage: selectedStage,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddTask(false);
    } catch (error) {
      Alert.alert('Task was not created', getErrorMessage(error));
    } finally {
      setSavingTask(false);
    }
  }

  async function handleReopenTask(task: Task) {
    try {
      await changeStage({
        taskId: task._id,
        stage: 'testing',
      });
    } catch (error) {
      Alert.alert('Task was not reopened', getErrorMessage(error));
    }
  }

  async function handleMoveToStage(task: Task, stage: TaskStage) {
    if (task.stage === stage) {
      return;
    }

    try {
      await changeStage({
        taskId: task._id,
        stage,
      });
    } catch (error) {
      Alert.alert('Task stage was not changed', getErrorMessage(error));
    }
  }

  async function handleArchiveTask(task: Task) {
    try {
      await archiveTask({ taskId: task._id });
    } catch (error) {
      Alert.alert('Task archive failed', getErrorMessage(error));
    }
  }

  async function handleReorderStage(stage: TaskStage, orderedTasks: Task[]) {
    try {
      await reorderStage({
        projectId,
        stage,
        taskIds: orderedTasks.map((task) => task._id),
      });
    } catch (error) {
      Alert.alert('Task order was not saved', getErrorMessage(error));
    }
  }

  if (!isConvexConfigured) {
    return (
      <Screen>
        <ScreenHeader title="Board" />
        <EmptyState body="Set Convex URL" title="Convex" />
      </Screen>
    );
  }

  if (project === undefined || tasks === undefined) {
    return (
      <Screen>
        <Card>
          <Text className="text-base text-muted">Loading project...</Text>
        </Card>
      </Screen>
    );
  }

  if (!project) {
    return (
      <Screen>
        <EmptyState title="Project not found" />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="gap-5">
      <ScreenHeader
        actionIcon={Edit3}
        actionLabel="Edit"
        eyebrow="Project"
        title={project.title}
        onAction={() => router.push(`/projects/${projectId}/edit`)}
      />

      <View className="gap-3 rounded-usm border border-line bg-surface p-4">
        <View className="flex-row flex-wrap gap-2">
          <Badge label="Project" />
          {currentTask?.stage ? (
            <Badge
              backgroundColor={stageMeta[currentTask.stage as TaskStage].backgroundColor}
              color={stageMeta[currentTask.stage as TaskStage].color}
              label={stageMeta[currentTask.stage as TaskStage].label}
            />
          ) : (
            <Badge backgroundColor="#E8E2D6" color="#667067" label="Idle" />
          )}
        </View>
        <View className="gap-1">
          <Text className="text-xs font-semibold uppercase text-muted">Current</Text>
          <Text className="text-lg font-bold leading-6 text-ink" numberOfLines={2}>
            {currentTask?.title ?? 'None'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-2xl font-bold text-ink">Board</Text>
        </View>
        <Button
          className="shrink-0"
          icon={showAddTask ? X : Plus}
          label={showAddTask ? 'Close' : 'Add'}
          variant={showAddTask ? 'ghost' : 'primary'}
          onPress={() => setShowAddTask((isVisible) => !isVisible)}
        />
      </View>

      <View className="rounded-usm border border-line bg-surface p-2">
        {isWideBoard ? (
          <View className="flex-row gap-2">
            {activeTaskStages.map((stage) => (
              <View className="min-w-0 flex-1 rounded-usm bg-canvas" key={stage}>
                <StageColumn
                  contained
                  laneWidth={laneWidth}
                  stage={stage}
                  stageSequence={activeTaskStages}
                  tasks={tasksByStage[stage]}
                  onArchive={handleArchiveTask}
                  onMoveToStage={handleMoveToStage}
                  onOpenTask={(task) => router.push(`/tasks/${task._id}`)}
                  onReorder={handleReorderStage}
                />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            contentContainerClassName="gap-2"
            showsHorizontalScrollIndicator={false}
          >
            {activeTaskStages.map((stage) => (
              <View className="rounded-usm bg-canvas" key={stage} style={{ width: laneWidth }}>
                <StageColumn
                  compact
                  contained
                  laneWidth={laneWidth}
                  stage={stage}
                  stageSequence={activeTaskStages}
                  tasks={tasksByStage[stage]}
                  onArchive={handleArchiveTask}
                  onMoveToStage={handleMoveToStage}
                  onOpenTask={(task) => router.push(`/tasks/${task._id}`)}
                  onReorder={handleReorderStage}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        className="flex-row items-center gap-3 rounded-usm border border-line bg-surface p-4"
        onPress={() => setShowDoneTasks(true)}
      >
        <View className="h-11 w-11 items-center justify-center rounded-usm bg-accent-soft">
          <FolderCheck color="#256D85" size={21} />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-base font-bold text-ink">Done tasks</Text>
        </View>
        <View className="h-8 min-w-8 items-center justify-center rounded-full bg-success px-2">
          <Text className="text-xs font-bold text-white">{doneTasks.length}</Text>
        </View>
      </Pressable>

      <SheetDialog open={showAddTask} title="Add task" onClose={() => setShowAddTask(false)}>
        <View className="gap-4">
          <SegmentedTabs options={stageOptions} value={selectedStage} onChange={setSelectedStage} />
          <Input
            label="Task"
            placeholder="Design task detail flow"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <Input
            label="Notes"
            multiline
            placeholder="Notes"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
          />
          <View className="flex-row flex-wrap gap-2">
            <Button
              className="min-w-40 flex-1"
              disabled={!newTaskTitle.trim()}
              icon={Plus}
              label={`Add to ${stageMeta[selectedStage].shortLabel}`}
              loading={savingTask}
              onPress={handleCreateTask}
            />
            <Button
              className="min-w-32 flex-1"
              icon={X}
              label="Cancel"
              variant="ghost"
              onPress={() => setShowAddTask(false)}
            />
          </View>
        </View>
      </SheetDialog>

      <SheetDialog
        open={showDoneTasks}
        title={`Done tasks (${doneTasks.length})`}
        onClose={() => setShowDoneTasks(false)}
      >
        {doneTasks.length === 0 ? (
          <View className="rounded-usm border border-dashed border-line bg-surface p-4">
            <Text className="text-sm font-semibold text-muted">Empty</Text>
          </View>
        ) : (
          <ScrollView style={{ maxHeight: doneListMaxHeight }}>
            <View className="gap-3">
              {doneTasks.map((task) => (
                <View
                  className="gap-3 rounded-usm border border-line bg-surface p-4"
                  key={task._id}
                >
                  <View className="flex-row flex-wrap gap-2">
                    <Badge backgroundColor="#DCEFE3" color="#2F7D50" label="Done" />
                  </View>
                  <View className="gap-1">
                    <Text className="text-base font-bold text-ink">{task.title}</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    <Button
                      className="min-w-28 flex-1"
                      label="Open"
                      onPress={() => router.push(`/tasks/${task._id}`)}
                    />
                    <Button
                      className="min-w-28 flex-1"
                      icon={RotateCcw}
                      label="Reopen"
                      variant="secondary"
                      onPress={() => handleReopenTask(task)}
                    />
                    <Button
                      className="min-w-28 flex-1"
                      icon={Archive}
                      label="Archive"
                      variant="ghost"
                      onPress={() => handleArchiveTask(task)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SheetDialog>
    </Screen>
  );
}
