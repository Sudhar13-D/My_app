import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useGlobalSearchParams } from 'expo-router';

type Milestone = {
  id: string;
  name: string;
  duration: number; // duration in days
};

const STORAGE_KEY = '@milestones_storage_key';
const START_DATE_KEY = '@milestones_start_date';

export default function MilestoneListScreen() {
  const { goalData } = useGlobalSearchParams();
  const goalDataString = Array.isArray(goalData) ? goalData[0] : goalData;
  const goal = goalDataString ? JSON.parse(decodeURIComponent(goalDataString)) : null;

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDuration, setNewMilestoneDuration] = useState('');
  const [startDate, setStartDate] = useState<number | null>(null); // timestamp in ms

  // Load milestones and startDate from AsyncStorage or fallback to goal.milestones
  useEffect(() => {
    async function loadData() {
      try {
        const storedMilestones = await AsyncStorage.getItem(STORAGE_KEY);
        const storedStartDate = await AsyncStorage.getItem(START_DATE_KEY);

        if (storedMilestones) {
          setMilestones(JSON.parse(storedMilestones));
        } else if (goal?.milestones) {
          setMilestones(goal.milestones);
        }

        if (storedStartDate) {
          setStartDate(parseInt(storedStartDate, 10));
        }
      } catch (e) {
        console.error('Failed to load data', e);
        if (goal?.milestones) setMilestones(goal.milestones);
      }
    }
    loadData();
  }, []);

  // Save milestones whenever they change
  useEffect(() => {
    async function saveMilestones() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
      } catch (e) {
        console.error('Failed to save milestones', e);
      }
    }
    saveMilestones();
  }, [milestones]);

  // Save startDate whenever it changes
  useEffect(() => {
    async function saveStartDate() {
      if (startDate !== null) {
        try {
          await AsyncStorage.setItem(START_DATE_KEY, startDate.toString());
        } catch (e) {
          console.error('Failed to save start date', e);
        }
      }
    }
    saveStartDate();
  }, [startDate]);

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Error loading goal data.</Text>
      </View>
    );
  }

  function addMilestone() {
    if (!newMilestoneName.trim() || !newMilestoneDuration.trim()) {
      Alert.alert('Error', 'Please enter both milestone name and duration');
      return;
    }
    const durationNum = parseInt(newMilestoneDuration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Duration must be a positive number');
      return;
    }
    const newMilestone: Milestone = {
      id: `m${Date.now()}`,
      name: newMilestoneName.trim(),
      duration: durationNum,
    };
    setMilestones((prev) => [...prev, newMilestone]);
    setNewMilestoneName('');
    setNewMilestoneDuration('');
  }

  // Calculate how many days have passed since startDate
  function getElapsedDays(): number {
    if (!startDate) return 0;
    const now = Date.now();
    const diff = now - startDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24)); // convert ms to days
  }

  // Determine if a milestone is unlocked by summing durations of all previous milestones
  function isUnlocked(index: number): boolean {
    if (index === 0) return true; // first milestone always unlocked
    const elapsed = getElapsedDays();
    const durationSum = milestones
      .slice(0, index)
      .reduce((acc, m) => acc + m.duration, 0);
    return elapsed >= durationSum;
  }

  // Start progress on first milestone if not started yet
  function startProgressIfNeeded() {
    if (!startDate && milestones.length > 0) {
      setStartDate(Date.now());
    }
  }

  // Handler for milestone press
  function onMilestonePress(item: Milestone, index: number) {
    if (!isUnlocked(index)) {
      Alert.alert('Locked', 'This milestone is locked until previous milestones are complete.');
      return;
    }
    if (!startDate) {
      startProgressIfNeeded();
    }
    // Navigate manually using Link or router
    // Since you're using expo-router, one option is:
    // But in this example, let's just use Link with asChild.
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{goal.goal} - Milestones</Text>

      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const unlocked = isUnlocked(index);
          const milestoneData = encodeURIComponent(JSON.stringify(item));
          const encodedGoal = encodeURIComponent(JSON.stringify({ ...goal, milestones }));

          if (unlocked) {
            // If unlocked, wrap TouchableOpacity in Link for navigation
            return (
              <Link
                href={{
                  pathname: './task',
                  params: { goalData: encodedGoal, milestoneData },
                }}
                asChild
              >
                <TouchableOpacity
                 style={[styles.unlockedMilestoneCard, styles.unlockedMilestone]}

                  onPress={() => {
                    if (!startDate) startProgressIfNeeded();
                  }}
                >
                  <Text style={[styles.milestoneTitle, styles.lockedText1]}>{item.name}</Text>
                <Text style={[styles.milestoneDuration, styles.lockedText1]}>{item.duration} days</Text>
                </TouchableOpacity>
              </Link>
            );
          } else {
            // Locked milestone, just show greyed out card and show alert on press
            return (
              <TouchableOpacity
                style={[styles.milestoneCard, styles.lockedMilestone]}
                onPress={() =>
                  Alert.alert(
                    'Locked',
                    'This milestone is locked until previous milestones are complete.'
                  )
                }
              >
                <Text style={[styles.milestoneTitle, styles.lockedText]}>{item.name}</Text>
                <Text style={[styles.milestoneDuration, styles.lockedText]}>{item.duration} days</Text>
              </TouchableOpacity>
            );
          }
        }}
        ListEmptyComponent={
          <Text style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
            No milestones yet.
          </Text>
        }
      />

      <TextInput
        style={styles.input}
        placeholder="New Milestone Name"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f9ff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  milestoneCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#0003',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  lockedMilestone2: {
    backgroundColor: 'sky blue',
  },
  lockedMilestone: {
    backgroundColor: '#ddd',
  },
  milestoneTitle: { fontSize: 18, fontWeight: '600' },
  lockedText: { color: '#999' },
  milestoneDuration: { fontSize: 14, color: '#555', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  lockedText1: { color: 'black' },

  unlockedMilestone: {
  backgroundColor: '#fff',
},
unlockedMilestoneCard: {
  backgroundColor: 'blue',
  borderWidth: 1,
  borderColor: '#ccc',
  shadowColor: '#0003',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},



});
