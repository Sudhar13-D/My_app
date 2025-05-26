import React, {useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const predefinedGoals = [
  {
    id: 'g1',
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
    isTemplate: true,
  },
];

export default function GoalListScreen() {
  const [customGoals, setCustomGoals] = useState([]);
  const [loading, setLoading] = useState(true);

 useFocusEffect(
  React.useCallback(() => {
    async function loadCustomGoals() {
      try {
        const savedGoals = await AsyncStorage.getItem('customGoals');
        if (savedGoals) {
          setCustomGoals(JSON.parse(savedGoals));
        } else {
          setCustomGoals([]);
        }
      } catch (e) {
        console.error('Failed to load custom goals', e);
      } finally {
        setLoading(false);
      }
    }
    loadCustomGoals();
  }, [])
);
 

  const allGoals = [...customGoals, ...predefinedGoals];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading Goals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Goals</Text>
      <FlatList
        data={allGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const encodedGoal = encodeURIComponent(JSON.stringify(item));
          const isCustom = !item.isTemplate;
          const destination = isCustom ? '/milestone-list' : '/template-milestone-list';

          return (
            <Link
              href={{
                pathname: destination,
                params: { goalData: encodedGoal },
              }}
              asChild
            >
              <TouchableOpacity style={styles.goalCard}>
                <Text style={styles.goalTitle}>{item.goal}</Text>
                <Text style={styles.goalDuration}>{item.duration} days</Text>
                <Text style={{ color: isCustom ? '#007AFF' : '#888', fontSize: 12 }}>
                  {isCustom ? 'Custom Goal' : 'Template'}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        }}
      />
      <Link href="./create-goal" asChild>
        <TouchableOpacity style={styles.customGoalButton}>
          <Text style={styles.customGoalText}>+ Create Custom Goal</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f9ff' },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  goalCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#0002',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  goalTitle: { fontSize: 20, fontWeight: '600' },
  goalDuration: { fontSize: 14, color: '#555', marginTop: 4 },
  customGoalButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  customGoalText: { color: 'white', textAlign: 'center', fontSize: 16 },
});
