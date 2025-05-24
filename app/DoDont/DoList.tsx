import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/component/Task';
import TaskProperties from '@/component/TaskProperties';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function DoList() {
  const [taskList, setTaskList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const setStringValue = async (value: string) => {
    try {
      await AsyncStorage.setItem('task', value);
    } catch (e) {
      alert(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('task');
      if (value !== null) {
        setTaskList(JSON.parse(value));
      }
    } catch (e) {
      console.log('Error loading data:', e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const saveTaskList = (updatedList: any[]) => {
    setTaskList(updatedList);
    setStringValue(JSON.stringify(updatedList));
  };

  const handleTaskPropertiesConfirm = (taskData: any) => {
    let updatedList = [...taskList];

    if (editIndex !== null) {
      updatedList[editIndex] = {
        ...taskData,
        completed: updatedList[editIndex].completed || false,
      };
      setEditIndex(null);
    } else {
      const isDuplicate = updatedList.some(
  (task) =>
    task.taskName === taskData.taskName &&
    task.taskScheduledTime === taskData.taskScheduledTime
);

      if (isDuplicate) {
        alert('This task already exists.');
        return;
      }

      updatedList.push({ ...taskData, completed: false });
    }

    saveTaskList(updatedList);
    setShowForm(false);
  };

  const deleteTask = (index: number) => {
    const updatedList = [...taskList];
    updatedList.splice(index, 1);
    saveTaskList(updatedList);
  };

  const editTask = (index: number) => {
    setEditIndex(index);
    setShowForm(true);
  };

  const toggleComplete = (index: number) => {
    const updatedList = [...taskList];
    updatedList[index].completed = !updatedList[index].completed;
    updatedList.sort((a, b) => a.completed - b.completed);
    saveTaskList(updatedList);
  };

  const completedCount = taskList.filter((task) => task.completed).length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={showForm ? [] : taskList}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={
            showForm ? (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowForm(false);
                    setEditIndex(null);
                  }}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.taskPropertyContainer}>
                  <TaskProperties
                    onConfirm={handleTaskPropertiesConfirm}
                    initialData={editIndex !== null ? taskList[editIndex] : null}
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>Today Task</Text>
                <Text style={styles.counter}>
                  {completedCount} / {taskList.length} completed
                </Text>
                <View style={styles.processBanner}>
                  <Text style={styles.processText}>
                    “You do not rise to the level of your goals. You fall to the level of your systems.”
                  </Text>
                  <Text style={styles.processAuthor}>— James Clear, Atomic Habits</Text>
                </View>
              </View>
            )
          }
          renderItem={
            !showForm
              ? ({ item, index }) => (
                  <Task
                    taskData={item}
                    onToggleComplete={() => toggleComplete(index)}
                    onDelete={() => deleteTask(index)}
                    onEdit={() => editTask(index)}
                  />
                )
              : undefined
          }
          ListFooterComponent={
            !showForm ? (
              <View style={styles.inputRow}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setEditIndex(null);
                    setShowForm(true);
                  }}
                >
                  <Text style={styles.plus}>+</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  counter: {
    textAlign: 'center',
    fontSize: width * 0.04,
    marginBottom: 5,
    color: '#666',
  },
  processBanner: {
    backgroundColor: '#E0F7FA',
    borderLeftWidth: 6,
    borderLeftColor: '#00BCD4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: width * 0.05,
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: '#F8F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  plus: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  taskPropertyContainer: {
    marginHorizontal: width * 0.05,
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  backButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: 10,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: width * 0.045,
    color: 'black',
  },
});
