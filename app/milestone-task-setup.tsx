import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function MilestoneTaskSetup() {
  const { milestoneData, goalData } = useLocalSearchParams();

  const milestone = milestoneData ? JSON.parse(decodeURIComponent(milestoneData as string)) : null;
  const goal = goalData ? JSON.parse(decodeURIComponent(goalData as string)) : null;

  if (!milestone || !goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No milestone or goal data found.</Text>
      </View>
    );
  }

  // Find index of this milestone
  const milestoneIndex = goal.milestones.findIndex((m: any) => m.id === milestone.id);

  // Calculate starting day number for this milestone
  const startDay =
    milestoneIndex > 0
      ? goal.milestones.slice(0, milestoneIndex).reduce((sum: number, m: any) => sum + m.duration, 0) + 1
      : 1;

  // Generate daily task list for the duration of the milestone
  const generateTasks = () => {
    const days = [];
    for (let i = 0; i < milestone.duration; i++) {
      days.push({
        day: startDay + i,
        tasks: [
          'Read and summarize key chapters',
          'Practice MCQs on topic',
          'Watch related video lectures',
          'Write notes and revise',
          'Take a short quiz/test',
        ],
      });
    }
    return days;
  };

  const allTasks = generateTasks();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{milestone.name}</Text>
      <Text style={styles.subHeading}>Duration: {milestone.duration} days</Text>

      <FlatList
        data={allTasks}
        keyExtractor={(item) => `day-${item.day}`}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskDay}>Day {item.day}:</Text>
            <View style={styles.taskList}>
              {item.tasks.map((task, index) => (
                <Text key={index} style={styles.taskDescription}>• {task}</Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eef3f9' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  subHeading: { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center' },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#0003',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  taskDay: { fontWeight: '700', marginBottom: 6, fontSize: 16 },
  taskList: { marginLeft: 10 },
  taskDescription: { fontSize: 14, color: '#333' },
  errorText: { fontSize: 18, textAlign: 'center', color: 'red' },
});
