import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Audio } from 'expo-av';

export default function First() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [selectedOption, setSelectedOption] = useState('Help');
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const deviceId = Constants.deviceId; // Using Expo Constants to get device ID

  useEffect(() => {
    playAudio(); // Play audio immediately when entering the page
    fetchLocation();
    fetchName(); // Fetch the latest name when the component mounts
  }, []);

  const playAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/vijayanna2.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio. Please try again later.', [{ text: 'OK' }]);
    }
  };
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location.coords);
      }
    } catch (error) {
      console.error('Error getting location:', error.message);
    }
  };

  const fetchName = async () => {
    try {
      const response = await axios.get(`http://192.168.1.8:3005/get-name?deviceId=${deviceId}`);
      if (response.data.success) {
        setName(response.data.name);
      } else {
        console.error('Error fetching name:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching name:', error.message);
    }
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        const response = await axios.post('http://192.168.1.8:3005/submit-form', {
          name,
          phoneNumber,
          numberOfPersons,
          selectedOption,
          location,
          deviceId, // Include device ID in the form submission
        });

        console.log('Server Response:', response.data);
        setSubmitted(true);

        // Show alert upon successful form submission
        Alert.alert('Success', 'Form submitted successfully!', [{ text: 'OK' }]);
        
        // Delay navigation to MainPage after 3 seconds
        setTimeout(() => {
          navigation.navigate('Mainpage');
        }, 1000);
      } catch (error) {
        console.error('Error submitting form:', error);
        Alert.alert('Error', 'Failed to submit form. Please try again later.', [{ text: 'OK' }]);
      }
    } else {
      alert('Please fill in all fields and ensure the mobile number has 10 digits');
    }
  };

  const validateInputs = () => {
    if (name && phoneNumber.length === 10 && numberOfPersons && !isNaN(numberOfPersons)) {
      return true;
    }
    return false;
  };

  if (submitted) {
    return null; // or any component you want to render after submission
  }

  return (
    <ImageBackground
      source={require('./assets/flood.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <View style={styles.boxContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter your name"
            />

            <Text style={styles.label}>Mobile number:</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              placeholder="Enter the Mobile Number"
              keyboardType="numeric"
            />

            <Text style={styles.label}>No of Persons:</Text>
            <TextInput
              style={styles.input}
              value={numberOfPersons}
              onChangeText={(text) => setNumberOfPersons(text)}
              placeholder="Enter the number of persons"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Select Option:</Text>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedOption === 'Help' && styles.radioButtonSelected,
                ]}
                onPress={() => setSelectedOption('Help')}
              >
                <Text style={styles.radioButtonText}>Help</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedOption === 'Food' && styles.radioButtonSelected,
                ]}
                onPress={() => setSelectedOption('Food')}
              >
                <Text style={styles.radioButtonText}>Food</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 80,
    marginTop: 20,
    marginBottom: 20,
  },
  boxContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#1B8AE6',
  },
  radioButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#1B8AE6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

