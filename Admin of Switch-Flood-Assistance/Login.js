// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      // Validate email format (you can add more validation if needed)
      if (!email) {
        Alert.alert('Error', 'Please enter an email');
        return;
      }

      // Call your backend for login validation
      const response = await fetch('http://192.168.1.8:3005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        // If login is successful, navigate to Mainpage
        navigation.navigate('Helpmenu');
      } else {
        // If login fails, show an error message
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ImageBackground source={require('./assets/wall.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.transparentBox}>
          {/* Logo */}
          <Image source={require('./assets/adminlogo.png')} style={styles.logo} />

          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Adjust the alpha value for transparency
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center', // Center content horizontally
  },
  logo: {
    width: 100, // Adjust the width of the logo as needed
    height: 100, // Adjust the height of the logo as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'silver',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 30,
    padding: 10,
    backgroundColor: 'white',
    width: '100%', // Take up the full width
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%', // Take up the full width
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Login;
