// Mainpage.js
import React, { useRef, useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function Mainpage() {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handlePress = async () => {
    // Load and play audio
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/vijayanna.mp3')
    );
    await sound.playAsync();
    
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(true);
      });
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleHelpMenuPress = () => {
    closeModal();
    navigation.navigate('First');
  };

  const handleStatusReviewPress = () => {
    closeModal();
    navigation.navigate('Finalpage');
  };

  return (
    <ImageBackground
      source={require('./assets/mainpage.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.View
              style={[
                styles.animatedButton,
                { transform: [{ scale: scaleValue }] },
              ]}
            >
              <FontAwesome name="handshake-o" size={40} color="white" />
              <Text style={styles.buttonText}>CLICK HERE!</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleHelpMenuPress}
              >
                <FontAwesome name="handshake-o" size={24} color="black" />
                <Text style={[styles.modalButtonText, { color: 'white' }]}>
                  Help Menu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleStatusReviewPress}
              >
                <FontAwesome name="info-circle" size={24} color="black" />
                <Text style={[styles.modalButtonText, { color: 'white' }]}>
                  Status Review
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeModal}
              >
                <Text
                  style={[
                    styles.modalCloseButtonText,
                    { color: 'darkblue' },
                  ]}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 80,
   bottom:260,
 
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  animatedButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
    borderRadius: 11,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    elevation: 5,
    position: 'absolute',
    bottom:'20%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 12,
    marginTop:7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 300,
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  modalCloseButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: 'blue',
    fontSize: 18,
  },
});
