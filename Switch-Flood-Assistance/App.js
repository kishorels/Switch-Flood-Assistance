// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import First from './First'; // Import First component
import Mainpage from './Mainpage';
import Finalpage from './Finalpage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Mainpage">
        <Stack.Screen
          name="First"
          component={First}
          options={{ headerShown: false }}
        />
        <Stack.Screen
         name="Mainpage" 
        component={Mainpage}
        options={{ headerShown: false }}
         />
        <Stack.Screen 
        name="Finalpage" 
        component={Finalpage}
        options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
