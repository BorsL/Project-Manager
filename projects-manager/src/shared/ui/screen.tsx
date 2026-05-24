import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
}>;

export function Screen({
  children,
  scroll = true,
  className = '',
  contentClassName = '',
}: ScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView className={`flex-1 bg-canvas ${className}`}>
        <View className={`flex-1 px-4 pb-4 pt-3 ${contentClassName}`}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-canvas ${className}`}>
      <ScrollView contentContainerClassName={`gap-5 px-4 pb-8 pt-3 ${contentClassName}`}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
