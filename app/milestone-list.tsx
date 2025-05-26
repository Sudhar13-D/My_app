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

export default function MilestoneListScreen() {
  const { goalData } = useGlobalSearchParams();
  const goalDataString = Array.isArray(goalData) ? goalData[0] : goalData;
  const goal = goalDataString ? JSON.parse(decodeURIComponent(goalDataString)) : null;

  const milestoneStorageKey = goal ? `@milestones_${goal.goal}` : null;
  const startDateStorageKey = goal ? `@startdate_${goal.goal}` : null;

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDuration, setNewMilestoneDuration] = useState('');
  const [startDate, setStartDate] = useState<number | null>(null);

  // Load milestones and startDate for this specific goal
  useEffect(() => {
    async function loadData() {
      try {
        if (milestoneStorageKey && startDateStorageKey) {
          const storedMilestones = await AsyncStorage.getItem(milestoneStorageKey);
          const storedStartDate = await AsyncStorage.getItem(startDateStorageKey);

          if (storedMilestones) {
            setMilestones(JSON.parse(storedMilestones));
          } else if (goal?.milestones) {
            setMilestones(goal.milestones);
          }

          if (storedStartDate) {
            setStartDate(parseInt(storedStartDate, 10));
          }
        }
      } catch (e) {
        console.error('Failed to load data', e);
        if (goal?.milestones) setMilestones(goal.milestones);
      }
    }
    loadData();
  }, [milestoneStorageKey, startDateStorageKey]);

  // Save milestones
  useEffect(() => {
    async function saveMilestones() {
      try {
        if (milestoneStorageKey) {
          await AsyncStorage.setItem(milestoneStorageKey, JSON.stringify(milestones));
        }
      } catch (e) {
        console.error('Failed to save milestones', e);
      }
    }
    saveMilestones();
  }, [milestones]);

  // Save startDate
  useEffect(() => {
    async function saveStartDate() {
      try {
        if (startDateStorageKey && startDate !== null) {
          await AsyncStorage.setItem(startDateStorageKey, startDate.toString());
        }
      } catch (e) {
        console.error('Failed to save start date', e);
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

  function getElapsedDays(): number {
    if (!startDate) return 0;
    const now = Date.now();
    const diff = now - startDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function isUnlocked(index: number): boolean {
    if (index === 0) return true;
    const elapsed = getElapsedDays();
    const durationSum = milestones
      .slice(0, index)
      .reduce((acc, m) => acc + m.duration, 0);
    return elapsed >= durationSum;
  }

  function startProgressIfNeeded() {
    if (!startDate && milestones.length > 0) {
      setStartDate(Date.now());
    }
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
