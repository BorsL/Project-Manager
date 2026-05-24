import { api } from '@convex/_generated/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { isConvexConfigured, useConfiguredMutation } from '@/shared/lib/convex';
import { getErrorMessage } from '@/shared/lib/format';
import { Button, Card, EmptyState, Input, Screen, ScreenHeader } from '@/shared/ui';

const projectColors = ['#256D85', '#6F5EBA', '#2F7D50', '#A35F18', '#B74343'];

export function CreateProjectScreen() {
  const createProject = useConfiguredMutation(api.projects.create);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(projectColors[0]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      const projectId = await createProject({
        title,
        description: description || undefined,
        color,
      });
      router.replace(`/projects/${projectId}`);
    } catch (error) {
      Alert.alert('Project was not created', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader title="New Project" />
      {!isConvexConfigured ? (
        <EmptyState body="Set Convex URL" title="Convex" />
      ) : (
        <Card className="gap-4">
          <Input
            label="Name"
            placeholder="Projects Manager MVP"
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
            {projectColors.map((option) => (
              <Pressable
                accessibilityLabel={`Use project color ${option}`}
                accessibilityRole="button"
                className={`h-11 w-11 rounded-usm border ${
                  option === color ? 'border-ink' : 'border-line'
                }`}
                key={option}
                style={{ backgroundColor: option }}
                onPress={() => setColor(option)}
              />
            ))}
          </View>
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
