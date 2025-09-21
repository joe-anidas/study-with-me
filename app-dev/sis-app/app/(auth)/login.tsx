import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === 'admin' && password === 'admin') {
      await AsyncStorage.setItem('userToken', 'admin-token');
      await AsyncStorage.setItem('userRole', 'admin');
      router.replace('/(app)/(admin)/dashboard');
      return;
    }

    // Check for faculty login (in a real app, this would be from a database)
    if (username.startsWith('faculty')) {
      await AsyncStorage.setItem('userToken', 'faculty-token');
      await AsyncStorage.setItem('userRole', 'faculty');
      router.replace('/(app)/(faculty)/dashboard');
      return;
    }

    // Check for student login (in a real app, this would be from a database)
    if (username.startsWith('student')) {
      await AsyncStorage.setItem('userToken', 'student-token');
      await AsyncStorage.setItem('userRole', 'student');
      router.replace('/(app)/(student)/dashboard');
      return;
    }

    Alert.alert('Error', 'Invalid credentials');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Information System</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});