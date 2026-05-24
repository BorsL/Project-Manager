import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ConvexProviderRoot } from '@/shared/lib/convex';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProviderRoot>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="todos/new" />
            <Stack.Screen name="projects/new" />
            <Stack.Screen name="projects/[projectId]/index" />
            <Stack.Screen name="projects/[projectId]/edit" />
            <Stack.Screen name="tasks/[taskId]" />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </ConvexProviderRoot>
    </GestureHandlerRootView>
  );
}
