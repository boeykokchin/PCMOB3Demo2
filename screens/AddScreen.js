import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function AddScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
