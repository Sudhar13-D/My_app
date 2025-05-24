import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Habit = {
  id: string;
  title: string;
  isDone: boolean;
  history: Record<string, boolean>;
};

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const router = useRouter();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const stored = await AsyncStorage.getItem('habits');
    const parsed: Habit[] = stored ? JSON.parse(stored) : [];

    const updated = parsed.map(habit => {
      if (habit.history[today] === undefined) {
        habit.history[today] = false;
      }
      return {
        ...habit,
        isDone: habit.history[today],
      };
    });

    await AsyncStorage.setItem('habits', JSON.stringify(updated));
    setHabits(updated);
  };

  const saveHabits = async (updated: Habit[]) => {
    await AsyncStorage.setItem('habits', JSON.stringify(updated));
    setHabits(updated);
  };

  const toggleHabit = async (id: string) => {
    const updated = habits.map(habit => {
      if (habit.id === id) {
        const newStatus = !habit.isDone;
        habit.isDone = newStatus;
        habit.history[today] = newStatus;
      }
      return habit;
    });
    saveHabits(updated);
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return Alert.alert('Please enter a habit');

    const newHabitObj: Habit = {
      id: Date.now().toString(),
      title: newHabit.trim(),
      isDone: false,
      history: { [today]: false },
    };

    const updated = [...habits, newHabitObj];
    await saveHabits(updated);
    setNewHabit('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.logButton} onPress={() => router.push('/log')}>
            <Text style={styles.logButtonText}>View Log</Text>
          </Pressable>
        </View>

        {/* Motivational Banner */}
        <View style={styles.processBanner}>
          <Text style={styles.processText}>
            “You do not rise to the level of your goals. You fall to the level of your systems.”
          </Text>
          <Text style={styles.processAuthor}>— James Clear, Atomic Habits</Text>
        </View>

        <Text style={styles.header}>Today's Habits</Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Enter new habit"
            value={newHabit}
            onChangeText={setNewHabit}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addHabit}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {habits.map(habit => (
          <View key={habit.id} style={styles.habitCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitTitle}>{habit.title}</Text>
              <Text style={styles.habitQuote}>
              
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleHabit(habit.id)}
              style={[
                styles.toggleButton,
                { backgroundColor: habit.isDone ? '#4CAF50' : '#F44336' },
              ]}
            >
              <Text style={styles.buttonText}>
                {habit.isDone ? 'Done' : 'Pending'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9FB',
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  logButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  processBanner: {
    backgroundColor: '#E0F7FA',
    borderLeftWidth: 6,
    borderLeftColor: '#00BCD4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  processText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#00796B',
  },
  processAuthor: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '500',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  habitTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  habitQuote: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    fontStyle: 'italic',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
