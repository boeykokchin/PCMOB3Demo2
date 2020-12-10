import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('todo.db');

function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([
    { title: 'Kill cat', done: false, id: '0' },
    { title: 'Kill elephant', done: true, id: '1' },
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <MaterialCommunityIcons
            name='circle-edit-outline'
            size={40}
            style={{ color: 'orange', marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  function addNote() {
    let newNote = {
      title: 'Sample new note',
      done: false,
      id: `${notes.length}`,
    };
    setNotes([...notes]);
    navigation.navigate('Add Note');
  }

  function renderItem({ item }) {
    return (
      <View
        style={{ padding: 20, borderBottomColor: '#ccc', borderBottomWidth: 1 }}
      >
        <Text style={{ textAlign: 'left', fontSize: 16 }}>{item.title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={notes}
        renderItem={renderItem}
      />
    </View>
  );
}

const InnerStack = createStackNavigator();

function NotesStack() {
  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name='Notes'
        component={NotesScreen}
        options={{
          headerTitle: 'Notes App',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
          headerStyle: {
            height: 120,
            backgroundColor: 'yellow',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
          },
        }}
      ></InnerStack.Screen>
    </InnerStack.Navigator>
  );
}

function AddScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Add Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 10 }}
      >
        <Text style={{ color: 'orange' }}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
