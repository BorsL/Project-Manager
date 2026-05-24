import { api } from '@convex/_generated/api';
import { router } from 'expo-router';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  Map as MapIcon,
  Plus,
  SkipForward,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

import type { RoadmapItem } from '@/entities/roadmap/model';
import { isConvexConfigured, useConfiguredMutation, useConfiguredQuery } from '@/shared/lib/convex';
import { getErrorMessage } from '@/shared/lib/format';
import type { RoadmapStatus } from '@/shared/model/domain';
import { roadmapStatusMeta } from '@/shared/model/domain';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  ListRow,
  Screen,
  ScreenHeader,
} from '@/shared/ui';

type PositionInputProps = {
  position: number;
  max: number;
  onCommit: (position: number) => void;
};

function PositionInput({ position, max, onCommit }: PositionInputProps) {
  const [value, setValue] = useState(String(position));

  useEffect(() => {
    setValue(String(position));
  }, [position]);

  function commit() {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      setValue(String(position));
      return;
    }

    const nextPosition = Math.min(Math.max(parsed, 1), max);
    setValue(String(nextPosition));
    if (nextPosition !== position) {
      onCommit(nextPosition);
    }
  }

  return (
    <View className="flex-row items-center gap-1 rounded-usm border border-line bg-surface-muted px-2 py-1">
      <Text className="text-sm font-semibold text-muted">#</Text>
      <TextInput
        accessibilityLabel={`Roadmap position ${position}`}
        className="h-9 w-10 text-center text-base font-bold text-ink"
        keyboardType="number-pad"
        returnKeyType="done"
        selectTextOnFocus
        value={value}
        onBlur={commit}
        onChangeText={setValue}
        onSubmitEditing={commit}
      />
    </View>
  );
}

export function RoadmapScreen() {
  const roadmap = useConfiguredQuery(api.roadmap.list, {}) as RoadmapItem[] | undefined;
  const addNote = useConfiguredMutation(api.roadmap.addNote);
  const moveItem = useConfiguredMutation(api.roadmap.move);
  const reorderRoadmap = useConfiguredMutation(api.roadmap.reorder);
  const setPosition = useConfiguredMutation(api.roadmap.setPosition);
  const markStatus = useConfiguredMutation(api.roadmap.markStatus);
  const archiveItem = useConfiguredMutation(api.roadmap.archive);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAddNote() {
    setSaving(true);
    try {
      await addNote({ title });
      setTitle('');
    } catch (error) {
      Alert.alert('Roadmap note was not added', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(item: RoadmapItem, status: RoadmapStatus) {
    try {
      await markStatus({ itemId: item._id, status });
    } catch (error) {
      Alert.alert('Roadmap status failed', getErrorMessage(error));
    }
  }

  async function handleArchive(item: RoadmapItem) {
    try {
      await archiveItem({ itemId: item._id });
    } catch (error) {
      Alert.alert('Roadmap archive failed', getErrorMessage(error));
    }
  }

  async function handleReorder(items: RoadmapItem[]) {
    try {
      await reorderRoadmap({
        itemIds: items.map((item) => item._id),
      });
    } catch (error) {
      Alert.alert('Roadmap order was not saved', getErrorMessage(error));
    }
  }

  async function handleSetPosition(item: RoadmapItem, position: number) {
    try {
      await setPosition({
        itemId: item._id,
        position,
      });
    } catch (error) {
      Alert.alert('Roadmap position was not saved', getErrorMessage(error));
    }
  }

  function openLinkedItem(item: RoadmapItem) {
    if (item.taskId) {
      router.push(`/tasks/${item.taskId}`);
      return;
    }
    if (item.projectId) {
      router.push(`/projects/${item.projectId}`);
    }
  }

  if (!isConvexConfigured) {
    return (
      <Screen>
        <ScreenHeader title="Roadmap" />
        <EmptyState body="Set Convex URL" icon={MapIcon} title="Convex" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Roadmap" />

      <View className="gap-3 rounded-usm border border-accent bg-accent-soft p-4">
        <View className="gap-1">
          <Text className="text-sm font-semibold uppercase text-accent">New</Text>
          <Text className="text-2xl font-bold text-ink">Note</Text>
        </View>
        <Input placeholder="Follow up" value={title} onChangeText={setTitle} />
        <Button
          disabled={!title.trim()}
          icon={Plus}
          label="Add"
          loading={saving}
          onPress={handleAddNote}
        />
      </View>

      <View className="gap-1">
        <Text className="text-2xl font-bold text-ink">Order</Text>
      </View>

      {roadmap === undefined ? (
        <Card>
          <Text className="text-base text-muted">Loading roadmap...</Text>
        </Card>
      ) : roadmap.length === 0 ? (
        <EmptyState icon={MapIcon} title="Empty roadmap" />
      ) : (
        <DraggableFlatList
          activationDistance={10}
          data={roadmap}
          ItemSeparatorComponent={() => <View className="h-3" />}
          keyExtractor={(item) => item._id}
          renderItem={({ item, drag, isActive, getIndex }) => {
            const index = getIndex() ?? 0;
            const status = roadmapStatusMeta[item.status as RoadmapStatus];
            const hasLink = Boolean(item.taskId || item.projectId);
            return (
              <ScaleDecorator>
                <ListRow
                  className={isActive ? 'border-accent bg-accent-soft' : ''}
                  key={item._id}
                  right={<GripVertical color="#667067" size={20} />}
                  title={item.title}
                  onLongPress={drag}
                  onPress={hasLink ? () => openLinkedItem(item) : undefined}
                >
                  <View className="mt-3 flex-row flex-wrap items-center gap-2">
                    <Badge label={item.kind.toUpperCase()} />
                    <PositionInput
                      max={roadmap.length}
                      position={index + 1}
                      onCommit={(position) => handleSetPosition(item, position)}
                    />
                    <Badge
                      backgroundColor={status.backgroundColor}
                      color={status.color}
                      label={status.label}
                    />
                    <IconButton
                      disabled={index === 0}
                      icon={ArrowUp}
                      label="Move up"
                      onPress={() => moveItem({ itemId: item._id, direction: 'up' })}
                    />
                    <IconButton
                      disabled={index === roadmap.length - 1}
                      icon={ArrowDown}
                      label="Move down"
                      onPress={() => moveItem({ itemId: item._id, direction: 'down' })}
                    />
                    <IconButton
                      icon={CheckCircle2}
                      label="Mark done"
                      tone="accent"
                      onPress={() => handleStatus(item, 'done')}
                    />
                    <IconButton
                      icon={SkipForward}
                      label="Skip"
                      onPress={() => handleStatus(item, 'skipped')}
                    />
                    <IconButton
                      icon={Archive}
                      label="Archive"
                      tone="danger"
                      onPress={() => handleArchive(item)}
                    />
                  </View>
                </ListRow>
              </ScaleDecorator>
            );
          }}
          scrollEnabled={false}
          onDragEnd={({ data, from, to }) => {
            if (from !== to) {
              handleReorder(data);
            }
          }}
        />
      )}
    </Screen>
  );
}
