import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useGlobalSearchParams } from 'expo-router';
interface Milestone {
  id: string;
  name: string;
  duration: number;
}
interface Goal {
  id: string;
  goal: string;
  duration: number;
  milestones: Milestone[];
}


export default function GoalDetailsScreen() {
  
  const { goalData } = useGlobalSearchParams();
  const router = useRouter();

  // Parse goalData safely, fallback to null if invalid or absent
    let initialGoal = null;
if (goalData) {
  let dataString = '';
  if (Array.isArray(goalData)) {
    dataString = goalData[0];
  } else {
    dataString = goalData;
  }
    try {
      initialGoal = JSON.parse(decodeURIComponent(dataString));
    } catch {
      initialGoal = null;
    }
  }
  

  const [goalName, setGoalName] = useState(initialGoal?.goal || '');
  const [duration, setDuration] = useState(initialGoal?.duration?.toString() || '');
  const [milestones, setMilestones] = useState<Milestone[]>(initialGoal?.milestones || []);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDuration, setNewMilestoneDuration] = useState('');

  // Generate id: existing for editing, or new for creation
  const goalId = initialGoal?.id || `g${Date.now()}`;

  function addMilestone() {
    if (!newMilestoneName.trim() || !newMilestoneDuration.trim()) {
      Alert.alert('Error', 'Please fill milestone name and duration');
      return;
    }
    const durationNum = parseInt(newMilestoneDuration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Milestone duration must be a positive number');
      return;
    }
    setMilestones((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        name: newMilestoneName.trim(),
        duration: durationNum,
      },
    ]);
    setNewMilestoneName('');
    setNewMilestoneDuration('');
  }

  async function saveGoal() {
    if (!goalName.trim() || !duration.trim()) {
      Alert.alert('Error', 'Goal name and duration are required');
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Duration must be a positive number');
      return;
    }

    try {
      const existing = await AsyncStorage.getItem('customGoals');
const goals: Goal[] = existing ? JSON.parse(existing) : [];


      const goalIndex = goals.findIndex((g) => g.id === goalId);

      const updatedGoal = {
        id: goalId,
        goal: goalName.trim(),
        duration: durationNum,
        milestones,
      };

      if (goalIndex > -1) {
        goals[goalIndex] = updatedGoal;
      } else {
        goals.push(updatedGoal);
      }

      await AsyncStorage.setItem('customGoals', JSON.stringify(goals));
      Alert.alert('Success', 'Goal saved successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save goal');
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>


  

      <Text style={styles.subHeading}>Milestones</Text>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.milestoneRow}>
            <Text>{item.name}</Text>
            <Text>{item.duration} days</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ fontStyle: 'italic' }}>No milestones added yet</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Milestone Name"
        value={newMilestoneName}
        onChangeText={setNewMilestoneName}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (days)"
        keyboardType="numeric"
        value={newMilestoneDuration}
        onChangeText={setNewMilestoneDuration}
      />

      <Button title="Add Milestone" onPress={addMilestone} />

      <View style={{ marginTop: 30 }}>
        <Button title="Save Goal" onPress={saveGoal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f9ff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subHeading: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});
