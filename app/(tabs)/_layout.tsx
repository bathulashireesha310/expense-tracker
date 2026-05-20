import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2f95dc', headerTitleAlign: 'center' }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Dashboard', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{ title: 'Log Outflow', tabBarIcon: ({color}) => <Ionicons name="add-circle" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="stats" 
        options={{ title: 'Analytics', tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}
