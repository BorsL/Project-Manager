import type { LucideIcon } from 'lucide-react-native';
import { Archive, GripVertical } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, Text, Vibration, View } from 'react-native';

import type { Task } from '@/entities/task/model';
import type { TaskStage } from '@/shared/model/domain';
import { stageMeta, taskStages } from '@/shared/model/domain';

type StageColumnProps = {
  stage: TaskStage;
  tasks: Task[];
  compact?: boolean;
  contained?: boolean;
  laneWidth?: number;
  stageSequence?: readonly TaskStage[];
  onOpenTask: (task: Task) => void;
  onMoveToStage: (task: Task, stage: TaskStage) => void;
  onArchive: (task: Task) => void;
  onReorder: (stage: TaskStage, tasks: Task[]) => void;
};

type StageTaskCardProps = {
  task: Task;
  stage: TaskStage;
  taskIndex: number;
  taskCount: number;
  compact: boolean;
  laneWidth: number;
  stageSequence: readonly TaskStage[];
  onOpen: () => void;
  onMoveToStage: (stage: TaskStage) => void;
  onMoveWithinStage: (toIndex: number) => void;
  onArchive: () => void;
};

function getDragTargetStage(
  stage: TaskStage,
  distance: number,
  laneWidth: number,
  stageSequence: readonly TaskStage[],
) {
  const threshold = Math.max(42, laneWidth * 0.35);
  if (Math.abs(distance) < threshold) {
    return stage;
  }

  const currentIndex = stageSequence.indexOf(stage);
  const rawStep = Math.round(distance / Math.max(laneWidth, 1));
  const stageStep = rawStep === 0 ? Math.sign(distance) : rawStep;
  const nextIndex = Math.min(Math.max(currentIndex + stageStep, 0), stageSequence.length - 1);

  return stageSequence[nextIndex] ?? stage;
}

function getDragTargetIndex(
  taskIndex: number,
  taskCount: number,
  distance: number,
  compact: boolean,
) {
  const rowStep = compact ? 100 : 124;
  const rawIndex = taskIndex + Math.round(distance / rowStep);

  return Math.min(Math.max(rawIndex, 0), Math.max(taskCount - 1, 0));
}

function vibrate(ms: number) {
  if (Platform.OS !== 'web') {
    Vibration.vibrate(ms);
  }
}

function MiniActionButton({
  icon: Icon,
  label,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className="h-9 w-9 items-center justify-center rounded-usm border border-line bg-surface"
      onPress={onPress}
    >
      <Icon color="#B74343" size={17} />
    </Pressable>
  );
}

function StageTaskCard({
  task,
  stage,
  taskIndex,
  taskCount,
  compact,
  laneWidth,
  stageSequence,
  onOpen,
  onMoveToStage,
  onMoveWithinStage,
  onArchive,
}: StageTaskCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const dragTargetStage = useRef(stage);
  const dragTargetIndex = useRef(taskIndex);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
        onPanResponderGrant: () => {
          dragTargetStage.current = stage;
          dragTargetIndex.current = taskIndex;
          setIsDragging(true);
          vibrate(8);
        },
        onPanResponderMove: (_event, gestureState) => {
          translateX.setValue(gestureState.dx);
          translateY.setValue(gestureState.dy);

          const nextStage = getDragTargetStage(stage, gestureState.dx, laneWidth, stageSequence);
          if (nextStage !== dragTargetStage.current) {
            dragTargetStage.current = nextStage;
            vibrate(6);
          }

          const nextIndex = getDragTargetIndex(taskIndex, taskCount, gestureState.dy, compact);
          if (nextStage === stage && nextIndex !== dragTargetIndex.current) {
            dragTargetIndex.current = nextIndex;
            vibrate(5);
          }
        },
        onPanResponderRelease: (_event, gestureState) => {
          const targetStage = getDragTargetStage(stage, gestureState.dx, laneWidth, stageSequence);
          const targetIndex = getDragTargetIndex(taskIndex, taskCount, gestureState.dy, compact);

          if (targetStage !== stage) {
            onMoveToStage(targetStage);
            vibrate(12);
          } else if (targetIndex !== taskIndex) {
            onMoveWithinStage(targetIndex);
            vibrate(10);
          }

          Animated.parallel([
            Animated.spring(translateX, {
              bounciness: 0,
              speed: 20,
              toValue: 0,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.spring(translateY, {
              bounciness: 0,
              speed: 20,
              toValue: 0,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]).start(() => setIsDragging(false));
        },
        onPanResponderTerminate: () => {
          Animated.parallel([
            Animated.spring(translateX, {
              bounciness: 0,
              speed: 20,
              toValue: 0,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.spring(translateY, {
              bounciness: 0,
              speed: 20,
              toValue: 0,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]).start(() => setIsDragging(false));
        },
      }),
    [
      compact,
      laneWidth,
      onMoveToStage,
      onMoveWithinStage,
      stage,
      stageSequence,
      taskCount,
      taskIndex,
      translateX,
      translateY,
    ],
  );

  const activeClasses = isDragging ? 'border-accent bg-accent-soft' : 'bg-surface';
  const cardClasses = compact
    ? `gap-2 rounded-usm border border-line p-2 ${activeClasses}`
    : `gap-3 rounded-usm border border-line p-4 ${activeClasses}`;
  const cardScale = isDragging ? 1.03 : 1;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        elevation: isDragging ? 10 : 0,
        transform: [{ translateX }, { translateY }, { scale: cardScale }],
        zIndex: isDragging ? 20 : 0,
      }}
    >
      <View className={cardClasses}>
        <View className="flex-row items-start gap-2">
          <Pressable
            accessibilityRole="button"
            className="min-w-0 flex-1"
            delayLongPress={120}
            onPress={onOpen}
          >
            <Text
              className={`${compact ? 'text-xs leading-4' : 'text-base'} font-semibold text-ink`}
              numberOfLines={compact ? 3 : 2}
            >
              {task.title}
            </Text>
          </Pressable>
          <View className="h-9 w-8 items-center justify-center rounded-usm">
            <GripVertical color="#667067" size={compact ? 17 : 20} />
          </View>
        </View>

        <View className="flex-row gap-1">
          <MiniActionButton icon={Archive} label="Archive task" onPress={onArchive} />
        </View>
      </View>
    </Animated.View>
  );
}

export function StageColumn({
  stage,
  tasks,
  compact = false,
  contained = false,
  laneWidth = 220,
  stageSequence = taskStages,
  onOpenTask,
  onMoveToStage,
  onArchive,
  onReorder,
}: StageColumnProps) {
  const meta = stageMeta[stage];
  const shellClassName = contained
    ? `gap-3 ${compact ? 'p-1' : 'p-2'}`
    : `gap-3 rounded-usm border border-line bg-surface ${compact ? 'p-2' : 'p-4'}`;

  function handleMoveWithinStage(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }

    const orderedTasks = [...tasks];
    const [task] = orderedTasks.splice(fromIndex, 1);
    if (!task) {
      return;
    }

    orderedTasks.splice(toIndex, 0, task);
    onReorder(stage, orderedTasks);
  }

  return (
    <View className={shellClassName}>
      <View className="gap-2">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={`${compact ? 'text-sm' : 'text-lg'} min-w-0 flex-1 font-bold text-ink`}
            numberOfLines={1}
          >
            {compact ? meta.shortLabel : meta.label}
          </Text>
          <View
            className={`${compact ? 'h-6 min-w-6 px-1' : 'h-7 min-w-7 px-2'} items-center justify-center rounded-full`}
            style={{ backgroundColor: meta.backgroundColor }}
          >
            <Text className="text-xs font-bold" style={{ color: meta.color }}>
              {tasks.length}
            </Text>
          </View>
        </View>
      </View>

      {tasks.length === 0 ? (
        <View className="rounded-usm border border-dashed border-line bg-canvas/60 p-3">
          <Text className="text-sm leading-5 text-muted">Empty</Text>
        </View>
      ) : (
        <View className="gap-2">
          {tasks.map((task, index) => (
            <StageTaskCard
              compact={compact}
              key={task._id}
              laneWidth={laneWidth}
              stage={stage}
              stageSequence={stageSequence}
              task={task}
              taskCount={tasks.length}
              taskIndex={index}
              onArchive={() => onArchive(task)}
              onMoveToStage={(nextStage) => onMoveToStage(task, nextStage)}
              onMoveWithinStage={(toIndex) => handleMoveWithinStage(index, toIndex)}
              onOpen={() => onOpenTask(task)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
