import { api } from '@convex/_generated/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Archive } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import type { Project } from '@/entities/project/model';
import { isConvexConfigured, useConfiguredMutation, useConfiguredQuery } from '@/shared/lib/convex';
import { getErrorMessage } from '@/shared/lib/format';
import { Button, Card, EmptyState, Input, Screen, ScreenHeader } from '@/shared/ui';

const projectColors = ['#256D85', '#6F5EBA', '#2F7D50', '#A35F18', '#B74343'];

export function ProjectEditScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const project = useConfiguredQuery(api.projects.get, { projectId }) as Project | null | undefined;
  const updateProject = useConfiguredMutation(api.projects.update);
  const archiveProject = useConfiguredMutation(api.projects.archive);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(projectColors[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!project) {
      return;
    }

    setTitle(project.title);
    setDescription(project.description ?? '');
    setColor(project.color ?? projectColors[0]);
  }, [project]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProject({
        projectId,
        title,
        description: description || undefined,
        color,
      });
      router.replace(`/projects/${projectId}`);
    } catch (error) {
      Alert.alert('Project was not updated', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    try {
      await archiveProject({ projectId });
      router.replace('/projects');
    } catch (error) {
      Alert.alert('Project was not archived', getErrorMessage(error));
    }
  }

  if (!isConvexConfigured) {
    return (
      <Screen>
        <ScreenHeader title="Edit Project" />
        <EmptyState body="Set Convex URL" title="Convex" />
      </Screen>
    );
  }

  if (project === undefined) {
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
    <Screen>
      <ScreenHeader title="Edit Project" />
      <Card className="gap-4">
        <Input label="Name" value={title} onChangeText={setTitle} />
        <Input label="Notes" multiline value={description} onChangeText={setDescription} />
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink">Color</Text>
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
        </View>
        <View className="gap-3">
          <Button
            disabled={!title.trim()}
            label="Save Changes"
            loading={saving}
            onPress={handleSave}
          />
          <Button icon={Archive} label="Archive Project" variant="danger" onPress={handleArchive} />
        </View>
      </Card>
    </Screen>
  );
}
