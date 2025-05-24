import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CreateGoalScreen() {
  const [goalName, setGoalName] = useState('');
  const [duration, setDuration] = useState('');
  const router = useRouter();

  async function saveGoal() {
    if (!goalName || !duration) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
    const newGoal = {
      id: `custom-${Date.now()}`,
      goal: goalName,
      duration: parseInt(duration, 10),
      milestones: [],
      isTemplate: false,
    };
    try {
      const existing = await AsyncStorage.getItem('customGoals');
      const goals = existing ? JSON.parse(existing) : [];
      goals.unshift(newGoal); // add to front
      await AsyncStorage.setItem('customGoals', JSON.stringify(goals));
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save goal');
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create New Goal</Text>
      <TextInput
        style={styles.input}
        placeholder="Goal Name"
        value={goalName}
        onChangeText={setGoalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (days)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />
      <Button title="Save Goal" onPress={saveGoal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f9ff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});
