import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesStack from './screens/NotesStack';
import AddScreen from './screens/AddScreen';
import EditScreen from './screens/EditScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        mode='modal'
        headerMode='none'
        screenOptions={{ headerTintColor: 'orange' }}
      >
        <Stack.Screen
          name='Notes Stack'
          component={NotesStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Add Note' component={AddScreen} />
        <Stack.Screen name='Edit Note' component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
