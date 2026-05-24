import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/shared/ui';

type WorkItemCardProps = PropsWithChildren<{
  kind: string;
  title: string;
  meta: string;
  statusLabel?: string;
  statusColor?: string;
  statusBackgroundColor?: string;
  detail?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
}>;

export function WorkItemCard({
  kind,
  title,
  meta,
  statusLabel,
  statusColor = '#256D85',
  statusBackgroundColor = '#D9EDF2',
  detail,
  right,
  children,
  onPress,
}: WorkItemCardProps) {
  return (
    <View className="gap-4 rounded-usm border border-line bg-surface p-4">
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        className="gap-4"
        onPress={onPress}
      >
        <View className="flex-row items-start gap-3">
          <View className="min-w-0 flex-1 gap-3">
            <View className="flex-row flex-wrap gap-2">
              <Badge label={kind} />
              {statusLabel ? (
                <Badge
                  backgroundColor={statusBackgroundColor}
                  color={statusColor}
                  label={statusLabel}
                />
              ) : null}
            </View>
            <View className="gap-1">
              <Text className="text-lg font-bold leading-6 text-ink">{title}</Text>
              <Text className="text-xs font-semibold uppercase text-muted">{meta}</Text>
            </View>
          </View>
          {right ? <View className="shrink-0">{right}</View> : null}
        </View>
        {detail ? <View>{detail}</View> : null}
      </Pressable>
      {children ? <View className="flex-row flex-wrap gap-2">{children}</View> : null}
    </View>
  );
}
