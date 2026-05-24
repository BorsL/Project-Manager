import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from './button';

type ScreenHeaderProps = {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
};

export function ScreenHeader({
  title,
  eyebrow,
  actionLabel,
  actionIcon,
  onAction,
}: ScreenHeaderProps) {
  return (
    <View className="gap-4">
      <View className="gap-2">
        {eyebrow ? (
          <Text className="text-sm font-semibold uppercase text-accent">{eyebrow}</Text>
        ) : null}
        <Text className="text-3xl font-bold leading-9 text-ink">{title}</Text>
      </View>
      {actionLabel && onAction ? (
        <Button className="self-start" icon={actionIcon} label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
