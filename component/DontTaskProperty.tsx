import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DontTaskProperties({ onConfirm }: { onConfirm: (taskData: any) => void; initialData?: any }) {
  const [taskName, setTaskName] = useState('');
  const [related, setRelated] = useState('');
  const [level, setLevel] = useState('');
  const [allocatedTime, setAllocatedTime] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const [unitOpen, setUnitOpen] = useState(false);
  const [unitValue, setUnitValue] = useState<string | null>('');
  const [unitItems, setUnitItems] = useState([
    { label: 'Hrs', value: 'Hrs' },
    { label: 'Mins', value: 'Mins' },
  ]);

  const [unitOpen1, setUnitOpen1] = useState(false);
  const [unitValue1, setUnitValue1] = useState<string | null>('');
  const [unitItems1, setUnitItems1] = useState([
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ]);

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      alert("Please enter what you're trying to avoid.");
      return;
    }

    const taskData: any = {
      taskName: taskName.trim(),
      taskRelated: related,
      taskLevel: level,
      taskAllocatedTime: `${allocatedTime} ${unitValue}`,
      taskScheduledTime: `${scheduledTime} ${unitValue1}`,
    };

    onConfirm(taskData);

    try {
      const existingTasks = await AsyncStorage.getItem('dont');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      tasks.push(taskData);
      await AsyncStorage.setItem('dont', JSON.stringify(tasks));
      alert("Don't task saved");

      setTaskName('');
      setRelated('');
      setLevel('');
      setAllocatedTime('');
      setScheduledTime('');
      setUnitValue('');
      setUnitValue1('');
    } catch (e) {
      console.error('Saving error:', e);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.header}>What should you avoid today?</Text>
        <TextInput
          value={taskName}
          onChangeText={setTaskName}
          placeholder="e.g., Procrastination, Junk Food"
          style={styles.taskInput}
        />

        <Text style={styles.header}>Related To</Text>
        <View style={styles.rowWrap}>
         {['Time Wasting', 'Negative Habits', 'Toxic Relationships', 'Unproductive Activities', 'Health Neglect', 'Digital Distractions'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, related === item && { backgroundColor: 'orange' }]}
              onPress={() => setRelated(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.header}>How hard is it to avoid?</Text>
        <View style={styles.rowWrap}>
          {['Hard', 'Medium', 'Easy'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, level === item && { backgroundColor: 'lightgreen' }]}
              onPress={() => setLevel(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.header}>Temptation Time Duration</Text>
         <View style={styles.row}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={allocatedTime}
            onChangeText={setAllocatedTime}
            placeholder="00"
          />
          <View style={[styles.dropdown, { zIndex: 3000 }]}>
            <DropDownPicker
              open={unitOpen}
              value={unitValue}
              items={unitItems}
             
              setOpen={setUnitOpen}
              setValue={setUnitValue}
              setItems={setUnitItems}
              placeholder="Hrs/Mins"
              zIndex={1000}
            />
          </View>
        </View>

        <Text style={styles.header}>Likely Time to Slip</Text>
         <View style={styles.row}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={scheduledTime}
            onChangeText={setScheduledTime}
            placeholder="00"
          />
          <View style={[styles.dropdown, { zIndex: 2000 }]}>
            <DropDownPicker
              open={unitOpen1}
              value={unitValue1}
              items={unitItems1}
               listMode="SCROLLVIEW"
              dropDownDirection="BOTTOM"
              setOpen={setUnitOpen1}
              setValue={setUnitValue1}
              setItems={setUnitItems1}
              placeholder="AM/PM"
              zIndex={500}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Add Don't Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInput: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
  option: {
    minWidth: 120,
    height: 45,
    justifyContent: 'center',
    margin: 5,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 5,
  },
  input: {
    width: 100,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F8F8FF',
    borderColor: 'black',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  dropdown: {
    width: 100,
    marginLeft: 10,
    zIndex: 1000,
  },
  button: {
    width: 170,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff8c69',
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
