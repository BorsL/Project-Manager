import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`rounded-usm border border-line bg-surface p-4 ${className}`}>{children}</View>
  );
}
