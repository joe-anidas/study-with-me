import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import BMI from './screens/BMI';
import Expense from './screens/Expense';
import Metric from './screens/Metric';
import Todo from './screens/Todo';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BMI" component={BMI} />
        <Stack.Screen name="Expense" component={Expense} />
        <Stack.Screen name="Metric" component={Metric} />
        <Stack.Screen name="Todo" component={Todo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
