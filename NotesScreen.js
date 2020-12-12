import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('notes.db');
console.log(FileSystem.documentDirectory);

export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

  function refreshNotes() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM notes',
          null,
          (txObj, { rows: { _array } }) => setNotes(_array),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null
    );
  }

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS
        notes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          done INT);`
        );
      },
      null,
      refreshNotes
    );
  }, []);

  useEffect(() => {
    if (route.params?.text) {
      db.transaction(
        (tx) => {
          tx.executeSql('INSERT INTO notes (done, title) VALUES (0, ?)', [
            route.params.text,
          ]);
        },
        null,
        refreshNotes
      );
    }
  }, [route.params?.text]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <MaterialCommunityIcons
            name='plus-circle-outline'
            size={60}
            style={{ color: 'orange', marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  // useEffect(() => {
  //   if (route.params?.text) {
  //     const newNote = {
  //       title: route.params.text,
  //       done: false,
  //       id: `${notes.length}`,
  //     };
  //     setNotes([...notes, newNote]);
  //   }
  // }, [route.params?.text]);

  function addNote() {
    // let newNote = {
    //   title: 'Sample new note',
    //   done: false,
    //   id: `${notes.length}`,
    // };
    // setNotes([...notes]);
    navigation.navigate('Add Note');
  }

  function deleteNote(id) {
    console.log('deleting item stage', id);
  }

  function renderItem({ item }) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}
      >
        <View style={{ width: 270 }}>
          <Text
            dataDetectorType='all'
            numberOfLines={3}
            ellipsizeMode='head'
            style={{ fontSize: 20 }}
          >
            {item.title}
          </Text>
        </View>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <MaterialCommunityIcons
            name='checkbox-marked-circle-outline'
            size={30}
            style={{ color: 'blue' }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={30}
            style={{ color: 'red' }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
