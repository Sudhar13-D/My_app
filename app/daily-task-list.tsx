import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

type DailyTask = {
  id: string;
  title: string;
  completed: boolean;
  date: string; // <-- Add this line to store the scheduled date (e.g., "2025-05-23")
  completedDate?: string; // Optional: when the task was marked as completed
};



export default function DailyTaskListScreen() {
  const { milestoneId, goalId } = useLocalSearchParams();
  const [tasks, setTasks] = useState<DailyTask[]>([]);


  useEffect(() => {
    const loadTasks = async () => {
      const stored = await AsyncStorage.getItem(`tasks-${goalId}-${milestoneId}`);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    };
    loadTasks();
  }, []);

  const toggleTask = async (index: number) => {
    const updatedTasks = [...tasks];
    const today = new Date().toISOString().split('T')[0];
    updatedTasks[index].completed = true;
    updatedTasks[index].date = today;
    setTasks(updatedTasks);
    await AsyncStorage.setItem(`tasks-${goalId}-${milestoneId}`, JSON.stringify(updatedTasks));
  };

  const renderItem = ({ item, index }: { item: DailyTask; index: number }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.completed]}
      onPress={() => !item.completed && toggleTask(index)}
    >
      <Text style={styles.taskText}>{item.title}</Text>
      {item.completed && <Text style={styles.date}>Done on {item.date}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Daily Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<Text>No tasks found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6fc' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  completed: { backgroundColor: '#d1ffd1' },
  taskText: { fontSize: 18 },
  date: { marginTop: 5, fontSize: 14, color: '#555' },
});