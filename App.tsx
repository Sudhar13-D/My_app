import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '@/app/index';
import DoDont from './app/DoDont';
import DoList from '@/app/DoDont/DoList';
import DontList from '@/app/DoDont/DontList'
const Stack = createNativeStackNavigator();
function App(){
    
    return (

        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name ="Home" component={Index} />
            <Stack.Screen name ="DoDont" component={DoDont} />
            <Stack.Screen name ="DoList" component={DoList} />
            <Stack.Screen name ="DontList" component={DontList} />
            </Stack.Navigator> 
        </NavigationContainer>
    );

}
export default App;
