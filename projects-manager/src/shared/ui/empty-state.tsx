import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from './button';

type EmptyStateProps = {
  title: string;
  body?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, body, icon: Icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center gap-4 rounded-usm border border-dashed border-line bg-surface p-6">
      {Icon ? <Icon color="#256D85" size={32} /> : null}
      <View className="gap-2">
        <Text className="text-center text-xl font-bold text-ink">{title}</Text>
        {body ? <Text className="text-center text-sm leading-5 text-muted">{body}</Text> : null}
      </View>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
