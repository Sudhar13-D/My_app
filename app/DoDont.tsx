import {
  Image,
  StyleSheet,
  Platform,
  Button,
  Alert,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Link } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const { width, height } = Dimensions.get('window');

type Task = {
  id: string;
  task: string;
  completed: boolean;
  // other props if needed
};

export default function DoDont() {
  const navigation = useNavigation<NavigationProp>();
  const [userName, setUserName] = useState<string>('');
  const [motivationQuote, setMotivationQuote] = useState('');
const [quoteEditable, setQuoteEditable] = useState(true);
 const [isEditable, setIsEditable] = useState(true);



  const [completedCount, setCompletedCount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setUserName(storedName);
    };
    loadName();
  }, []);

  
  useEffect(() => {
  const loadMotivationalQuote = async () => {
    const storedQuote = await AsyncStorage.getItem('motivationalQuote');
    const storedDate = await AsyncStorage.getItem('motivationalQuoteDate');

    if (storedQuote) setMotivationQuote(storedQuote);

    if (storedDate) {
      const lastSaved = new Date(storedDate);
      const now = new Date();

      // Compare only date parts
      const sameDay =
        lastSaved.getDate() === now.getDate() &&
        lastSaved.getMonth() === now.getMonth() &&
        lastSaved.getFullYear() === now.getFullYear();

      if (sameDay) setQuoteEditable(false);
    }
  };
  loadMotivationalQuote();
}, []);
// Load tasks from AsyncStorage to get completed vs total count
  useEffect(() => {
    const loadTaskData = async () => {
      try {
        const taskString = await AsyncStorage.getItem('task');
        if (taskString) {
          const taskList: Task[] = JSON.parse(taskString);
          const completed = taskList.filter((t) => t.completed).length;
          setCompletedCount(completed);
          setTotalTasks(taskList.length);
        } else {
          setCompletedCount(0);
          setTotalTasks(0);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTaskData();
  }, []);

  // Prepare data for BarChart
  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedCount, totalTasks - completedCount],
      },
    ],
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
     
        <Text style={styles.greeting}> Do's & Don'ts</Text>

        <View style={styles.motivQouteContainer}>
  <TextInput
    style={styles.motivationInput}
    placeholder="Today's Motivational Quote!!"
    placeholderTextColor="#fff"
    value={motivationQuote}
    onChangeText={setMotivationQuote}
    editable = {quoteEditable}
    onBlur={async () => {
      if (quoteEditable) {
        await AsyncStorage.setItem('motivationalQuote', motivationQuote);
        await AsyncStorage.setItem('motivationalQuoteDate', new Date().toISOString());
        setQuoteEditable(false);
        Alert.alert('Saved!', "You've set your quote for today.");
      }
    }}
    
              
            
    
    multiline
  />
  <Text style={styles.infoText}>
                You can edit the quote again after 24 hours.
              </Text>
</View>



        <View style={styles.doButton}>
          <Link href="../DoDont/DoList" asChild>
            <TouchableOpacity style={styles.containerButton}>
              <Text style={styles.buttonText}>Do List</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.dontButton}>
          <Link href="../DoDont/DontList" asChild>
            <TouchableOpacity style={styles.containerButton2}>
              <Text style={styles.buttonText}>Don't List</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Replaced Nooftaskcompleted View with BarChart */}
        <View style={styles.chartContainer}>
          <Text style={styles.completedText}>Task Completion Status</Text>
          <BarChart
            data={data}
            width={width * 0.9}
            height={height * 0.2}
            fromZero
            showValuesOnTopOfBars
             yAxisLabel=""
             yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 1,
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    infoText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 40,
  },
  greeting: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: '600',
  },
  subGreeting: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
 motivQouteContainer: {
  width: width * 0.9,
  height: height * 0.2,
  borderRadius: 20,
  backgroundColor: 'orange',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  padding: 10,
},
 motivationInput: {
  height: height * 0.15,
  fontSize: 18, // increased font size
  borderColor: '#ffa726',
  borderWidth: 1,
  borderRadius: 10,
  padding: 10,
  textAlign: 'center', // center the text horizontally
  textAlignVertical: 'center', // center the text vertically (Android)
},

  containerButton: {
    width: width * 0.6,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton2: {
    width: width * 0.6,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  doButton: {
    marginTop: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  dontButton: {
    marginTop: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  chartContainer: {
    marginTop: 50,
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 20,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  completedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
