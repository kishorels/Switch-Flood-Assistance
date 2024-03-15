import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Helpmenu = () => {
  const [details, setDetails] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing indicator

  const navigation = useNavigation();

  useEffect(() => {
    fetchData(); // Fetch data on initial render
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true); // Set refreshing indicator to true while fetching data
      const response = await fetch('http://192.168.1.8:3005/get-details');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDetails(data.details);
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching details:', error.message);
    } finally {
      setRefreshing(false); // Set refreshing indicator back to false after fetching data
    }
  };

  const handleNamePress = async (name) => {
    setSelectedName(name);
    try {
      const response = await fetch(`http://192.168.1.8:3005/get-status-message?name=${encodeURIComponent(name)}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.message);
      } else {
        // If there's a fetch error or the status is not stored, set status to 'Pending'
        setStatus('Pending');
      }
    } catch (error) {
      console.error('Error fetching status message:', error.message);
      // If there's an error, set status to 'Pending'
      setStatus('Pending');
    }
  };

  const handleBackButton = () => {
    setSelectedName(null);
    // Reset status to empty when going back
    setStatus('');
  };

  const handleRefresh = () => {
    fetchData(); // Call fetchData to refresh the data
  };

  return (
    <ImageBackground
      source={require('./assets/back.png')}
      style={styles.backgroundImage}
    >
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Details</Text>
        {!selectedName && ( // Render refresh button only if selectedName is null
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        )}
        {selectedName ? (
          <View style={styles.detailContainer}>
            <FlatList
              data={details.filter((item) => item.name === selectedName)}
              keyExtractor={(item) => item._id} // Assuming MongoDB _id field
              renderItem={({ item }) => (
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailText}>Name: {item.name}</Text>
                  <Text style={styles.detailText}>Phone Number: {item.phoneNumber}</Text>
                  <Text style={styles.detailText}>Number of Persons: {item.numberOfPersons}</Text>
                  <Text style={styles.detailText}>Selected Option: {item.selectedOption}</Text>
                  <Text style={styles.detailText}>Location: {JSON.stringify(item.location)}</Text>
                  <Text style={styles.detailText}>Status: {status === 'Success' ? 'Success' : 'Pending'}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={handleBackButton}>
              <Text style={styles.backButton}>Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={details.map((item) => ({ name: item.name, _id: item._id, status: item.status }))}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleNamePress(item.name)}>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 11, // Adjusted padding to accommodate the status bar
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Adjust the alpha value for transparency
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black', // Adjusted text color for better visibility on the background
  },
  refreshButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'blue',
  },
  refreshButtonText: {
    fontSize: 16,
    color: 'white',
  },
  backButton: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 16,
  },
  detailContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the alpha value for transparency
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
  },
  detailTextContainer: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 18,
    color: 'black', // Change the text color for better contrast
    marginBottom: 8,
  },
  nameContainer: {
    backgroundColor: 'rgb(0, 142, 146)', // Adjust the alpha value for transparency
    borderRadius: 10,
    padding: 15,
    marginBottom: 9,
  },
  nameText: {
    fontSize: 18,
    color: 'black',
  },
});

export default Helpmenu;
