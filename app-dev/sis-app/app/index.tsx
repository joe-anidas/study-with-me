import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userRole = await AsyncStorage.getItem('userRole');
    
    if (!token) {
      // User is not logged in
      return;
    }
  };

  return <Redirect href="/(auth)/login" />;
}