import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link } from 'expo-router';

export default function GoalScreen() {
  const goalData = {
    goal: 'Crack UPSC CSE',
    duration: 365,
    milestones: [
      { id: 'm1', name: 'NCERT Foundation', duration: 60 },
      { id: 'm2', name: 'Standard Books', duration: 90 },
      { id: 'm3', name: 'Optional Subject Preparation', duration: 75 },
      { id: 'm4', name: 'Prelims Revision & Test Series', duration: 60 },
      { id: 'm5', name: 'Mains Writing Practice', duration: 60 },
      { id: 'm6', name: 'Interview Prep', duration: 20 },
    ],
  };

  const encodedGoalData = encodeURIComponent(JSON.stringify(goalData));

  // Optional: Validate sum of milestones equals goal duration (can be used in console)
  const sumMilestoneDuration = goalData.milestones.reduce((sum, m) => sum + m.duration, 0);
  if (sumMilestoneDuration !== goalData.duration) {
    console.warn(
      `Warning: Sum of milestone durations (${sumMilestoneDuration}) does not equal goal duration (${goalData.duration})`
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Goal: {goalData.goal}</Text>
      <Text style={styles.goalDuration}>Total Duration: {goalData.duration} days</Text>

      <FlatList
        data={goalData.milestones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <Link
              href={{
                pathname: '/milestone-task-setup',
                params: {
                  milestoneData: encodeURIComponent(JSON.stringify(item)),
                  goalData: encodedGoalData,
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.milestoneCard}>
                <Text style={styles.milestoneTitle}>{item.name}</Text>
                <Text style={styles.milestoneDuration}>Duration: {item.duration} days</Text>
              </TouchableOpacity>
            </Link>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eef3f9' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  goalDuration: { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center' },
  milestoneCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#0003',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  milestoneTitle: { fontSize: 20, fontWeight: '600' },
  milestoneDuration: { fontSize: 14, color: '#555', marginTop: 4 },
});
