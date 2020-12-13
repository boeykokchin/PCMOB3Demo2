import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SQLite from 'expo-sqlite';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('notes.db');
// console.log(FileSystem.documentDirectory);

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
        (key INTEGER PRIMARY KEY AUTOINCREMENT,
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

  const doneRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    db.transaction(
      (tx) => {
        tx.executeSql(`DELETE FROM notes WHERE key=${rowKey};`);
      },
      null,
      refreshNotes
    );
    console.log('rowDelete', rowKey);
  };

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey);
  };

  const onLeftAction = (rowKey) => {
    console.log('onLeftAction', rowKey);
  };

  const onRightAction = (rowKey) => {
    console.log('onRightAction', rowKey);
  };

  const onLeftActionStatusChange = (rowKey) => {
    console.log('onLeftActionStatusChange', rowKey);
  };

  const onRightActionStatusChange = (rowKey) => {
    console.log('onRightActionStatusChange', rowKey);
  };

  const VisibleItem = (props) => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      leftActionState,
      rightActionState,
    } = props;

    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 40,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, { height: rowHeightAnimatedValue }]}
      >
        <TouchableHighlight
          style={styles.rowFrontVisible}
          onPress={() => console.log('Element touched')}
          underlayColor={'#aaa'}
        >
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {data.item.title}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              {data.item.details}
            </Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  const HiddenItemWithActions = (props) => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onDone,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 400,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false,
      }).start();
    }

    return (
      <Animated.View
        style={[styles.rowBack, { height: rowHeightAnimatedValue }]}
      >
        <Text>Left</Text>
        {!leftActionActivated && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={onDone}
          >
            <MaterialCommunityIcons
              name='check'
              size={25}
              style={styles.trash}
              color='#fff'
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}
            >
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name='trash-can-outline'
                  size={25}
                  color='#fff'
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onDone={() => doneRow(rowMap, data.item.key)}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  {
    // function renderItem({ item }) {
    //   return (
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         padding: 20,
    //         borderBottomColor: '#ccc',
    //         borderBottomWidth: 1,
    //       }}
    //     >
    //       <View style={{ width: 270 }}>
    //         <Text
    //           dataDetectorType='all'
    //           numberOfLines={3}
    //           ellipsizeMode='head'
    //           style={{ fontSize: 20 }}
    //         >
    //           {item.title}
    //         </Text>
    //       </View>
    //       <TouchableOpacity onPress={() => deleteNote(item.id)}>
    //         <MaterialCommunityIcons
    //           name='checkbox-marked-circle-outline'
    //           size={30}
    //           style={{ color: 'blue' }}
    //         />
    //       </TouchableOpacity>
    //       <TouchableOpacity onPress={() => deleteNote(item.id)}>
    //         <MaterialCommunityIcons
    //           name='close-circle-outline'
    //           size={30}
    //           style={{ color: 'red' }}
    //         />
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content'></StatusBar>
      <SwipeListView
        data={notes}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableRightSwipe
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={100}
        rightActivationValue={-200}
        leftActionValue={0}
        rightActionValue={-500}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
      />

      {
        // <FlatList
        //   style={{ width: '100%' }}
        //   data={notes}
        //   renderItem={renderItem}
        //   keyExtractor={(item) => `${item.id}`}
        // />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffc',
    backgroundColor: '#f4f4f4',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 30,
    width: 30,
    marginRight: 7,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 14,
    color: '#999',
  },
});
