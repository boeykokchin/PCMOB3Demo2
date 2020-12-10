import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('todo.db');

function HomeScreen({ navigation }) {
  const [lists, setLists] = useState([
    { title: 'Kill cat', done: false, id: '0' },
    { title: 'Kill elephant', done: true, id: '1' },
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addList}>
          <MaterialCommunityIcons
            name='circle-edit-outline'
            size={40}
            style={{ color: 'orange', marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  function addList() {
    let newList = {
      title: 'Sample new list',
      done: false,
      id: `${lists.length}`,
    };
    setLists([...lists]);
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
        data={lists}
        renderItem={renderItem}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: 'orange' }}>
        <Stack.Screen name='TODO' component={HomeScreen} />
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
