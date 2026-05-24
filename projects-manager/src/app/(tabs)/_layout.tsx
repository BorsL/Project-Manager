import { Tabs } from 'expo-router';
import { FolderKanban, ListTodo, Map as MapIcon } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="projects"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#256D85',
        tabBarInactiveTintColor: '#667067',
        tabBarStyle: {
          backgroundColor: '#FFFDF8',
          borderTopColor: '#DED8CB',
          minHeight: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="todos"
        options={{
          title: 'Todos',
          tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => <FolderKanban color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          title: 'Roadmap',
          tabBarIcon: ({ color, size }) => <MapIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
