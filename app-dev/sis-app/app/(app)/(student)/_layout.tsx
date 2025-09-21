import { Tabs } from 'expo-router';
import { FileText, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function StudentLayout() {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    router.replace('/(auth)/login');
  };

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'My Reports',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color, size }) => <LogOut size={size} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tabs>
  );
}