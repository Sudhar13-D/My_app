import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
export default function MilestoneTaskSetup() {
    const router = useRouter();
  const { milestoneData, goalData } = useLocalSearchParams();
  const milestone = milestoneData ? JSON.parse(decodeURIComponent(milestoneData as string)) : null;
  const goal = goalData ? JSON.parse(decodeURIComponent(goalData as string)) : null;

  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);
  const currentDay = 1;

  const taskKey = `goal-${goal?.id}-milestone-${milestone?.id}-day${currentDay}`;
  const completedKey = `${taskKey}-completed`;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem(taskKey);
        const savedCompleted = await AsyncStorage.getItem(completedKey);
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted));
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    };
    if (goal && milestone) loadTasks();
  }, [goal, milestone]);

  const addTask = async () => {
    if (!taskText.trim()) return;
    const updated = [...tasks, taskText.trim()];
    setTasks(updated);
    setTaskText('');
    Keyboard.dismiss();
    await AsyncStorage.setItem(taskKey, JSON.stringify(updated));
  };

  const markComplete = async (task: string) => {
    const updatedCompleted = [...completedTasks, task];
    setCompletedTasks(updatedCompleted);
    await AsyncStorage.setItem(completedKey, JSON.stringify(updatedCompleted));
  };

  const isCompleted = (task: string) => completedTasks.includes(task);

  if (!milestone || !goal) {
    return <View style={styles.container}><Text style={styles.errorText}>No milestone or goal data found.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{milestone.name} - Day {currentDay}</Text>
      <Text style={styles.subHeading}>Add tasks for Day {currentDay} only</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task for Day 1"
        value={taskText}
        onChangeText={setTaskText}
        onSubmitEditing={addTask}
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

     <TouchableOpacity
  style={styles.viewLogButton}
  onPress={() =>
    router.push({
      pathname: '/viewLog',
      params: {
        completedData: JSON.stringify(completedTasks),
        milestoneData: encodeURIComponent(JSON.stringify(milestone)),
        goalData: encodeURIComponent(JSON.stringify(goal)),
        day: currentDay,
      },
    })
  }
>
  <Text style={styles.viewLogText}>View Log</Text>
</TouchableOpacity>
      {showLog && (
        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Completed Tasks - Day {currentDay}</Text>
          {completedTasks.length === 0 ? (
            <Text style={styles.logItem}>No completed tasks yet.</Text>
          ) : (
            completedTasks.map((task, index) => (
              <Text key={index} style={styles.logItem}>✔ {task}</Text>
            ))
          )}
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 20 }}
        renderItem={({ item, index }) => (
          <View style={[styles.taskItem, isCompleted(item) && styles.completedTask]}>
            <Text style={styles.taskText}>{index + 1}. {item}</Text>
            {!isCompleted(item) && (
              <TouchableOpacity style={styles.completeButton} onPress={() => markComplete(item)}>
                <Text style={styles.completeText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#999' }}>No tasks added for Day {currentDay}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eef3f9' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  subHeading: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, fontSize: 16, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF', padding: 12, marginTop: 10,
    borderRadius: 10, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  taskItem: {
    backgroundColor: '#fff', padding: 12,
    marginBottom: 8, borderRadius: 10, borderColor: '#ddd', borderWidth: 1,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  taskText: { fontSize: 16, flex: 1 },
  completeButton: {
    backgroundColor: '#4CAF50', padding: 6, borderRadius: 8, marginLeft: 10,
  },
  completeText: { color: '#fff', fontSize: 14 },
  completedTask: {
    backgroundColor: '#d9fbd3',
  },
  viewLogButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 10,
    alignItems: 'center',
  },
  viewLogText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  logContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  logItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red' },
});
