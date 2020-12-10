import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NotesScreen({ navigation }) {
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
    // let newNote = {
    //   title: 'Sample new note',
    //   done: false,
    //   id: `${notes.length}`,
    // };
    // setNotes([...notes]);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
