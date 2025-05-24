import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const storedName = await AsyncStorage.getItem('userName');
    const storedGoal = await AsyncStorage.getItem('userGoal');
    if (storedName) setName(storedName);
    if (storedGoal) setGoal(storedGoal);
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userGoal', goal);
    Alert.alert('Saved', 'Your profile has been updated.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Enter your name"
        onChangeText={setName}
      />

      <Text style={styles.label}>Your Biggest Goal</Text>
      <TextInput
        style={styles.input}
        value={goal}
        placeholder="Enter your goal"
        onChangeText={setGoal}
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
