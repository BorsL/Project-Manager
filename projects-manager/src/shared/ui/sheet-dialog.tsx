import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SheetDialogProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>;

export function SheetDialog({ open, title, children, onClose }: SheetDialogProps) {
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(progress, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
      return;
    }

    Animated.timing(progress, {
      duration: 180,
      easing: Easing.in(Easing.cubic),
      toValue: 0,
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [open, progress]);

  if (!mounted) {
    return null;
  }

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [36, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });

  return (
    <Modal animationType="none" transparent visible={mounted} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View className="absolute inset-0 bg-black/35" style={{ opacity: progress }} />
        <Pressable className="absolute inset-0" onPress={onClose} />
        <Animated.View
          className="rounded-t-2xl bg-canvas shadow-lg"
          style={{
            opacity: progress,
            transform: [{ translateY }, { scale }],
          }}
        >
          <SafeAreaView edges={['bottom']} className="gap-4 p-4">
            <View className="flex-row items-center justify-between gap-4">
              <Text className="min-w-0 flex-1 text-xl font-bold text-ink">{title}</Text>
              <Pressable
                accessibilityRole="button"
                className="rounded-usm px-3 py-2"
                onPress={onClose}
              >
                <Text className="font-semibold text-accent">Close</Text>
              </Pressable>
            </View>
            {children}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
