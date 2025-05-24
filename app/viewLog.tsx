import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ViewLog() {
  const { completedData, milestoneData, goalData, day } = useLocalSearchParams();
  const completedTasks = completedData ? JSON.parse(completedData as string) : [];
  const milestone = milestoneData ? JSON.parse(decodeURIComponent(milestoneData as string)) : null;
  const goal = goalData ? JSON.parse(decodeURIComponent(goalData as string)) : null;

  if (!goal || !milestone) {
    return <View style={styles.container}><Text style={styles.errorText}>Missing data.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log for {milestone.name}</Text>
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>Day {day}</Text>
        {completedTasks.length === 0 ? (
          <Text style={styles.noTask}>No completed tasks for Day {day}.</Text>
        ) : (
          <FlatList
            data={completedTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.taskItem}>• {item}</Text>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef3f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  dayContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
  },
  taskItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  noTask: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
