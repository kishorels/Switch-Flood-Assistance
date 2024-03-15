
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login'; // Import First component
import Helpmenu from './Helpmenu';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
         name="Helpmenu" 
        component={Helpmenu}
        options={{ headerShown: true }}
         />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}