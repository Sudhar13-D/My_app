import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
type props ={
    title:string;
}

export default function DontTask({title}:props) {
  return (
      <View style={styles.viewStyle}>
        <View style={styles.taskContainer}>
          <Text style={styles.textStyle}>{title}</Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    viewStyle: {
      flex: 1,
      alignItems: 'center',
    },
    taskContainer: {
      width: 400,
      height: 75,
      borderRadius: 20,
      backgroundColor: 'red',
      justifyContent: 'center',   // vertical centering
       
      marginBottom:5      // horizontal centering
    },
    textStyle: {
      paddingHorizontal:30,
      fontSize: 20,
      color: 'white',
    },
  });