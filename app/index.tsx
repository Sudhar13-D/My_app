import React, { useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const navigation = useNavigation<NavigationProp>();
  const [quote, setQuote] = useState('');
  const [isEditable, setIsEditable] = useState(true);

  const QUOTE_KEY = 'quotekey';
  const QUOTE_TIME_KEY = 'quotetimekey';

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const savedQuote = await AsyncStorage.getItem(QUOTE_KEY);
        const savedTime = await AsyncStorage.getItem(QUOTE_TIME_KEY);

        if (savedQuote) setQuote(savedQuote);

        if (savedTime) {
          const lastSaved = new Date(parseInt(savedTime));
          const now = new Date();
          const diffHours = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60);
          if (diffHours < 24) {
            setIsEditable(false);
          } else {
            setIsEditable(true);
          }
        } else {
          setIsEditable(true);
        }
      } catch (e) {
        console.log('Error loading quote:', e);
      }
    };
    loadQuote();
  }, []);

  const saveQuote = async (newQuote: string) => {
    try {
      const now = new Date().getTime().toString();
      await AsyncStorage.setItem(QUOTE_KEY, newQuote);
      await AsyncStorage.setItem(QUOTE_TIME_KEY, now);
      setIsEditable(false);
      Alert.alert('Quote saved', 'You can edit it again after 24 hours.');
    } catch (e) {
      console.log('Error saving quote:', e);
    }
  };

  const handleQuoteChange = (text: string) => {
    setQuote(text);
  };

  const handleBlur = () => {
    if (quote.trim() !== '') {
      saveQuote(quote.trim());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'black' : 'white' }]}>
      <View style={styles.innerContainer}>
        {/* Settings Icon top-left */}
        <Link href="../Settings" asChild>
          <TouchableOpacity style={styles.settingsIcon}>
            <Icon name="settings-outline" size={28} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
        </Link>

        <Text style={[styles.header, { color: isDark ? 'white' : 'black' }]}>
          Do's & Dont App
        </Text>

        <TextInput
          style={[
            styles.motivQuoteContainer,
            {
              color: isDark ? 'white' : 'black',
              backgroundColor: isDark ? '#333' : '#f0f0f0',
            },
          ]}
          placeholder="Important Note of the day !"
          placeholderTextColor={isDark ? '#bbb' : '#333'}
          value={quote}
          onChangeText={handleQuoteChange}
          editable={isEditable}
          multiline
          onBlur={handleBlur}
        />

        {!isEditable && (
          <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#666' }]}>
            You can edit the note again after 24 hours.
          </Text>
        )}

        <View style={styles.buttonGrid}>
          <Link href="../DoDont" asChild>
            <TouchableOpacity style={styles.button1}>
              <Text style={styles.buttonText}>Do & Dont</Text>
            </TouchableOpacity>
          </Link>

          <Link href="../journal" asChild>
            <TouchableOpacity style={styles.button2}>
              <Text style={styles.buttonText}>Journal</Text>
            </TouchableOpacity>
          </Link>

          <Link href="../goal" asChild>
            <TouchableOpacity style={styles.button3}>
              <Text style={styles.buttonText}>Goal</Text>
            </TouchableOpacity>
          </Link>

          <Link href="../HabitTracker" asChild>
            <TouchableOpacity style={styles.button4}>
              <Text style={styles.buttonText}>Habit Tracker</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 8,
    zIndex: 10,
  },
  motivQuoteContainer: {
    marginTop: 30,
    width: 375,
    height: 100,
    borderRadius: 20,
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  infoText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  header: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 100,
  },
  button1: {
    backgroundColor: 'green',
    width: width * 0.42,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
  },
  button2: {
    backgroundColor: 'red',
    width: width * 0.42,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
  },
  button3: {
    backgroundColor: 'skyblue',
    width: width * 0.42,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
  },
  button4: {
    backgroundColor: 'orange',
    width: width * 0.42,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
