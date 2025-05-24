import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const notif = await AsyncStorage.getItem('notificationsEnabled');
    const theme = await AsyncStorage.getItem('darkModeEnabled');
    if (notif !== null) setNotificationsEnabled(notif === 'true');
    if (theme !== null) setDarkModeEnabled(theme === 'true');
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem('notificationsEnabled', newValue.toString());
  };

  const toggleTheme = async () => {
    const newValue = !darkModeEnabled;
    setDarkModeEnabled(newValue);
    await AsyncStorage.setItem('darkModeEnabled', newValue.toString());
  };

  const clearAllData = async () => {
    Alert.alert('Clear All Data', 'Are you sure you want to erase all data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert('Data Cleared', 'All app data has been removed.');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile Edit */}
       <Link href="../ProfileEditScreen" asChild>
      <TouchableOpacity
        style={styles.item}
      >
        <Text style={styles.label}>Edit Profile</Text>
        <Icon name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
      </Link>

      {/* Notification Toggle */}
      <View style={styles.item}>
        <Text style={styles.label}>Daily Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      {/* Theme Toggle */}
      <View style={styles.item}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkModeEnabled} onValueChange={toggleTheme} />
      </View>

      {/* Clear Data */}
      <TouchableOpacity style={styles.item} onPress={clearAllData}>
        <Text style={[styles.label, { color: 'red' }]}>Clear All Data</Text>
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>

      {/* About */}
      <View style={styles.item}>
        <Text style={styles.label}>App Version</Text>
        <Text style={styles.value}>v1.0.0</Text>
      </View>

      {/* Feedback */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => Alert.alert('Feedback', 'Send us your feedback at: yourmail@example.com')}
      >
        <Text style={styles.label}>Send Feedback</Text>
        <Icon name="mail" size={20} color="#888" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 18,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
});

export default Settings;
