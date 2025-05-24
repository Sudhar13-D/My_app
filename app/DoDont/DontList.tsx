import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task2 from '@/component/Task2';
import DontTaskProperties from '@/component/DontTaskProperty';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DontList() {
  const [dontList, setDontList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('dont');
        if (value !== null) {
          setDontList(JSON.parse(value));
        }
      } catch (e) {
        console.log('Error loading data:', e);
      }
    })();
  }, []);

  const saveDontList = async (updatedList: any[]) => {
    setDontList(updatedList);
    try {
      await AsyncStorage.setItem('dont', JSON.stringify(updatedList));
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  const handleTaskPropertiesConfirm = (taskData: any) => {
    const taskTitle = taskData.title?.trim().toLowerCase();
    let updatedList = [...dontList];

    const isDuplicate = (task: any, idx: number) =>
      task.title?.trim().toLowerCase() === taskTitle && idx !== editIndex;

    if (updatedList.some(isDuplicate)) {
      alert('This task already exists!');
      return;
    }

    if (editIndex !== null) {
      updatedList[editIndex] = {
        ...taskData,
        completed: updatedList[editIndex].completed || false,
      };
    } else {
      updatedList.push({ ...taskData, completed: false });
    }

    saveDontList(updatedList);
    setShowForm(false);
    setEditIndex(null);
  };

  const deleteDont = (index: number) => {
    const updatedList = dontList.filter((_, idx) => idx !== index);
    saveDontList(updatedList);
  };

  const editDont = (index: number) => {
    setEditIndex(index);
    setShowForm(true);
  };

  const toggleComplete = (index: number) => {
    const updatedList = [...dontList];
    updatedList[index].completed = !updatedList[index].completed;
    updatedList.sort((a, b) => a.completed - b.completed);
    saveDontList(updatedList);
  };

  const completedCount = dontList.filter((item) => item.completed).length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={showForm ? [] : dontList}
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
                  <DontTaskProperties
                    onConfirm={handleTaskPropertiesConfirm}
                    initialData={editIndex !== null ? dontList[editIndex] : null}
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>Today Don'ts</Text>
                <Text style={styles.counter}>
                  {completedCount} / {dontList.length} avoided
                </Text>
                <View style={styles.processBanner}>
                  <Text style={styles.processText}>
                    "By breaking a bad habit, you're casting a vote for the future you want."
                  </Text>
                  <Text style={styles.processAuthor}>— Inspired by Atomic Habits</Text>
                </View>
              </View>
            )
          }
          renderItem={
            !showForm
              ? ({ item, index }) => (
                  <Task2
                    taskData={item}
                    onToggleComplete={() => toggleComplete(index)}
                    onDelete={() => deleteDont(index)}
                    onEdit={() => editDont(index)}
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
