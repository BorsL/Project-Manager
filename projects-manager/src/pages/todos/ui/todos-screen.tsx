import { api } from '@convex/_generated/api';
import { router } from 'expo-router';
import { Archive, CheckCircle2, Circle, ListTodo, MapPlus, Plus } from 'lucide-react-native';
import { Alert, Text, View } from 'react-native';

import type { Task } from '@/entities/task/model';
import { isConvexConfigured, useConfiguredMutation, useConfiguredQuery } from '@/shared/lib/convex';
import { formatDate, getErrorMessage } from '@/shared/lib/format';
import { Button, Card, EmptyState, IconButton, Screen, ScreenHeader } from '@/shared/ui';
import { WorkItemCard } from '@/widgets/work-list/work-item-card';

export function TodosScreen() {
  const todos = useConfiguredQuery(api.tasks.listTodos, {}) as Task[] | undefined;
  const markDone = useConfiguredMutation(api.tasks.markDone);
  const archive = useConfiguredMutation(api.tasks.archive);
  const addTaskToRoadmap = useConfiguredMutation(api.roadmap.addTask);

  async function handleDone(task: Task) {
    try {
      await markDone({ taskId: task._id, done: !task.doneAt });
    } catch (error) {
      Alert.alert('Todo update failed', getErrorMessage(error));
    }
  }

  async function handleArchive(task: Task) {
    try {
      await archive({ taskId: task._id });
    } catch (error) {
      Alert.alert('Todo archive failed', getErrorMessage(error));
    }
  }

  async function handleAddToRoadmap(task: Task) {
    try {
      await addTaskToRoadmap({ taskId: task._id });
      Alert.alert('Added to roadmap', `${task.title} is now on the roadmap.`);
    } catch (error) {
      Alert.alert('Roadmap update failed', getErrorMessage(error));
    }
  }

  if (!isConvexConfigured) {
    return (
      <Screen>
        <ScreenHeader
          actionIcon={Plus}
          actionLabel="New Todo"
          title="Todos"
          onAction={() => router.push('/todos/new')}
        />
        <EmptyState body="Set Convex URL" icon={ListTodo} title="Convex" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        actionIcon={Plus}
        actionLabel="New Todo"
        title="Todos"
        onAction={() => router.push('/todos/new')}
      />

      {todos === undefined ? (
        <Card>
          <Text className="text-base text-muted">Loading todos...</Text>
        </Card>
      ) : todos.length === 0 ? (
        <EmptyState
          actionLabel="Create"
          icon={ListTodo}
          title="No todos"
          onAction={() => router.push('/todos/new')}
        />
      ) : (
        <View className="gap-3">
          {todos.map((todo) => (
            <WorkItemCard
              key={todo._id}
              kind="Todo"
              meta={`Updated ${formatDate(todo.updatedAt)}`}
              statusBackgroundColor={todo.doneAt ? '#DCEFE3' : '#D9EDF2'}
              statusColor={todo.doneAt ? '#2F7D50' : '#256D85'}
              statusLabel={todo.doneAt ? 'Done' : 'Open'}
              title={todo.title}
              onPress={() => router.push(`/tasks/${todo._id}`)}
            >
              <Button
                className="min-w-32 flex-1"
                label="Open"
                onPress={() => router.push(`/tasks/${todo._id}`)}
              />
              <Button
                className="min-w-32 flex-1"
                icon={MapPlus}
                label="Roadmap"
                variant="secondary"
                onPress={() => handleAddToRoadmap(todo)}
              />
              <Button
                className="min-w-32 flex-1"
                icon={todo.doneAt ? Circle : CheckCircle2}
                label={todo.doneAt ? 'Reopen' : 'Done'}
                variant="secondary"
                onPress={() => handleDone(todo)}
              />
              <IconButton
                icon={Archive}
                label="Archive todo"
                tone="danger"
                onPress={() => handleArchive(todo)}
              />
            </WorkItemCard>
          ))}
        </View>
      )}
    </Screen>
  );
}
