import { api } from '@convex/_generated/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { isConvexConfigured, useConfiguredMutation } from '@/shared/lib/convex';
import { getErrorMessage } from '@/shared/lib/format';
import { Button, Card, EmptyState, Input, Screen, ScreenHeader } from '@/shared/ui';

export function CreateTodoScreen() {
  const createTodo = useConfiguredMutation(api.tasks.createTodo);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await createTodo({
        title,
        description: description || undefined,
      });
      router.replace('/todos');
    } catch (error) {
      Alert.alert('Todo was not created', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader title="New Todo" />
      {!isConvexConfigured ? (
        <EmptyState body="Set Convex URL" title="Convex" />
      ) : (
        <Card className="gap-4">
          <Input
            label="Title"
            placeholder="Write release notes"
            value={title}
            onChangeText={setTitle}
          />
          <Input
            label="Notes"
            multiline
            placeholder="Notes"
            value={description}
            onChangeText={setDescription}
          />
          <View className="flex-row gap-3">
            <Button
              className="flex-1"
              label="Cancel"
              variant="ghost"
              onPress={() => router.back()}
            />
            <Button
              className="flex-1"
              disabled={!title.trim()}
              label="Create"
              loading={saving}
              onPress={handleSubmit}
            />
          </View>
        </Card>
      )}
    </Screen>
  );
}
