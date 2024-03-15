import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

export default function Finalpage() {
  const [status, setStatus] = useState('Pending');
  const [name, setName] = useState('');

  useEffect(() => {
    // Play audio when the component mounts
    playAudio();

    // Fetch name
    fetchName();
  }, []);

  const fetchName = async () => {
    try {
      const response = await axios.get('http://192.168.1.8:3005/get-name');

      if (response.data.success) {
        setName(response.data.name);
      } else {
        console.error('Error fetching name:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching name:', error.message);
    }
  };

  const playAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/vijayanna3.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error.message);
    }
  };

  const handleStatusChange = async () => {
    try {
      const response = await axios.post('http://192.168.1.8:3005/update-status', {
        name,
        status: 'Success',
      });

      if (response.data.success) {
        setStatus('Success');
        
        // Display success message
        Alert.alert('Success', 'Status updated successfully.');

        // Send a request to the backend to retrieve the updated status message
        const statusResponse = await axios.get(`http://192.168.1.8:3005/get-status-message?name=${name}`);
        
        if (statusResponse.data.success) {
          // Update status message
          setStatus(statusResponse.data.message);
        } else {
          console.error('Error retrieving status message:', statusResponse.data.message);
        }
      } else {
        console.error('Error updating status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/final.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.transparentBox}>
          <Text style={styles.heading}>Status Review</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>Status: {status}</Text>
            {status === 'Pending' && (
              <TouchableOpacity style={styles.button} onPress={handleStatusChange}>
                <Text style={styles.buttonText}>Change to Success</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.nameText}>Name: {name}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

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
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: 'black',
    position: 'relative',
    overflow: 'hidden',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBox: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
