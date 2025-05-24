import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useGlobalSearchParams } from 'expo-router';

export default function MilestoneListScreen() {
  const { goalData } = useGlobalSearchParams();
  const rawGoalData = goalData;
  const goalDataString = Array.isArray(rawGoalData) ? rawGoalData[0] : rawGoalData;
  const goal = goalDataString ? JSON.parse(decodeURIComponent(goalDataString)) : null;

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Error loading goal data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{goal.goal} - Milestones</Text>
      <FlatList
        data={goal.milestones}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const milestoneData = encodeURIComponent(JSON.stringify(item));
          const encodedGoal = encodeURIComponent(JSON.stringify(goal));

          // Determine if this milestone should be unlocked
          const isUnlocked = index === 0 || goal.milestones[index - 1]?.completed;

          if (isUnlocked) {
            return (
              <Link
                href={{
                  pathname: './task',
                  params: { goalData: encodedGoal, milestoneData },
                }}
                asChild
              >
                <TouchableOpacity style={styles.milestoneCard}>
                  <Text style={styles.milestoneTitle}>{item.name}</Text>
                  <Text style={styles.milestoneDuration}>{item.duration} days</Text>
                </TouchableOpacity>
              </Link>
            );
          } else {
            return (
              <View style={[styles.milestoneCard, styles.lockedCard]}>
                <Text style={[styles.milestoneTitle, styles.lockedText]}>{item.name}</Text>
                <Text style={[styles.milestoneDuration, styles.lockedText]}>
                  Locked until previous milestone is complete
                </Text>
              </View>
            );
          }
        }}
      />
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
  milestoneTitle: { fontSize: 18, fontWeight: '600' },
  milestoneDuration: { fontSize: 14, color: '#555', marginTop: 4 },
  lockedCard: {
    backgroundColor: '#e0e0e0',
  },
  lockedText: {
    color: '#999',
  },
});
