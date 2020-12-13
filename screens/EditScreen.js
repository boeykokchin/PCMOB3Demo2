import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('notes.db');

export default function EditScreen({ navigation, route }) {
  const [editText, setEditText] = useState(`${route.params.title}`);

  console.log('EditScreen:', route.params.key, route.params.title);

  let key = route.params.key;

  console.log(key);
  console.log('EditScreen:', editText);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[styles.label, { color: 'green' }]}>EDIT</Text>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextInput
          style={styles.textInput}
          value={editText}
          onChangeText={(newEditText) => setEditText(newEditText)}
          multiline={false}
          numberOfLines={1}
          textAlignVertical='top'
          fontSize={20}
          // placeholder='hello'
        ></TextInput>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notes', { editText, key });
          }}
          style={styles.button}
        >
          <MaterialCommunityIcons name='upload' size={60} color='green' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <MaterialCommunityIcons name='cancel' size={50} color='orange' />
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 40, color: 'grey' }}>You typed:</Text>
      <Text style={{ color: '#333', marginTop: 10 }}>{editText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontSize: 30,
  },

  textInput: {
    margin: 20,
    borderWidth: 1,
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
  },

  buttons: {
    flexDirection: 'row',
  },

  button: {
    padding: 10,
    margin: 5,
  },

  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },

  submitButton: {
    backgroundColor: 'orange',
  },

  cancelButton: {
    backgroundColor: 'red',
  },
});
