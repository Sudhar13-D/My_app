import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const JOURNAL_FOLDER = FileSystem.documentDirectory + 'JournalEntries/';

export default function JournalScreen() {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [showJournal, setShowJournal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const filePath = `${JOURNAL_FOLDER}${today}.json`;

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      const folderInfo = await FileSystem.getInfoAsync(JOURNAL_FOLDER);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(JOURNAL_FOLDER, { intermediates: true });
      }

      const lastDate = await AsyncStorage.getItem('lastSavedDate');
      if (lastDate && lastDate !== today) {
        const previousFilePath = `${JOURNAL_FOLDER}${lastDate}.json`;
        const destinationPath = FileSystem.documentDirectory + `../Download/${lastDate}.json`;

        const fileInfo = await FileSystem.getInfoAsync(previousFilePath);
        if (fileInfo.exists) {
          await FileSystem.copyAsync({
            from: previousFilePath,
            to: destinationPath,
          });
        }
      }

      await AsyncStorage.setItem('lastSavedDate', today);
      loadTodayEntries();
    })();
  }, []);

  const loadTodayEntries = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(filePath);
        setEntries(JSON.parse(content));
      } else {
        setEntries([]);
      }
    } catch {
      setEntries([]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addJournalItem = async () => {
    if (!text && !imageUri) {
      Alert.alert('Empty', 'Please enter text or pick an image.');
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry = { time, text, image: imageUri };

    const updatedEntries = [...entries, newEntry];

    try {
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedEntries), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setEntries(updatedEntries);
      setText('');
      setImageUri(null);
    } catch {
      Alert.alert('Error', 'Failed to save journal.');
    }
  };

  const deleteEntry = async (indexToDelete: number) => {
    const updatedEntries = entries.filter((_, index) => index !== indexToDelete);
    try {
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedEntries), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setEntries(updatedEntries);
    } catch {
      Alert.alert('Error', 'Failed to delete entry.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📝 Journal - {today}</Text>

      <TextInput
        style={styles.textInput}
        multiline
        placeholder="What's on your mind?"
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
      />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={addJournalItem}>
        <Text style={styles.buttonText}>Add to Journal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: showJournal ? '#e17055' : '#6c5ce7' }]}
        onPress={() => setShowJournal(!showJournal)}
      >
        <Text style={styles.buttonText}>{showJournal ? 'Hide Journal' : "Today's Journal"}</Text>
      </TouchableOpacity>

      {showJournal && (
        <View style={styles.journalContainer}>
          {entries.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No entries yet.</Text>
          ) : (
            entries.map((item, index) => (
              <View key={index} style={styles.entry}>
                <Text style={styles.time}>{item.time}</Text>
                {item.text ? <Text style={styles.entryText}>{item.text}</Text> : null}
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.entryImage} resizeMode="cover" />
                )}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#d63031', marginTop: 10 }]}
                  onPress={() => deleteEntry(index)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2d3436',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    minHeight: 100,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0984e3',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  journalContainer: {
    marginTop: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f1f2f6',
  },
  entry: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  time: {
    fontSize: 12,
    color: '#636e72',
    marginBottom: 6,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2d3436',
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});
