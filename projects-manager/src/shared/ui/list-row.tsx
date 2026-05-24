import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type ListRowProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}>;

export function ListRow({
  title,
  subtitle,
  right,
  className = '',
  children,
  onPress,
  onLongPress,
}: ListRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      className={`min-h-16 flex-row items-center gap-3 rounded-usm border border-line bg-surface p-4 ${className}`}
      delayLongPress={180}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-base font-semibold text-ink">{title}</Text>
        {subtitle ? <Text className="text-sm leading-5 text-muted">{subtitle}</Text> : null}
        {children}
      </View>
      {right ? <View className="shrink-0">{right}</View> : null}
    </Pressable>
  );
}
