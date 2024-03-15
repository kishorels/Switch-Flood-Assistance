const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3005;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Rippleofrelief', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Assuming you have a 'users' collection in your MongoDB
const UserSchema = new mongoose.Schema({
  email: String,
});

const Users = mongoose.model('users', UserSchema);

app.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the given email in the MongoDB database
    const user = await Users.findOne({ email });

    if (user) {
      // If the user is found, user is authenticated
      console.log('Login successful');
      res.json({ success: true, message: 'Login successful' });
    } else {
      // User with the given email not found
      console.log('User not found');
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET method to retrieve all users

// Assuming you have a 'details' collection in your MongoDB
const FormSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  numberOfPersons: Number,
  selectedOption: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
}, { timestamps: true }); // Added timestamps to track createdAt and updatedAt

const Details = mongoose.model('details', FormSchema);

// Assuming you have a 'statuses' collection in your MongoDB
const Status = mongoose.model('status', new mongoose.Schema({
  name: String,
  status: String,
}));

// POST method to submit form
app.post('/submit-form', async (req, res) => {
  try {
    const { name, phoneNumber, numberOfPersons, selectedOption, location } = req.body;

    const details = new Details({
      name,
      phoneNumber,
      numberOfPersons,
      selectedOption,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    });

    const savedForm = await details.save();
    console.log('Form Data Saved:', savedForm);

    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/get-details', async (req, res) => {
  try {
    const details = await Details.find().sort({ createdAt: -1 });

    res.json({ success: true, details });
  } catch (error) {
    console.error('Error retrieving details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/get-status-message', async (req, res) => {
  try {
    const latestStatus = await Status.findOne().sort({ createdAt: -1 });

    if (latestStatus) {
      console.log('Status message retrieved:', latestStatus.status);
      res.json({ success: true, message: latestStatus.status });
    } else {
      console.log('No status message found, returning default "Pending" status');
      res.json({ success: true, message: 'Pending' }); // Return default "Pending" status
    }
  } catch (error) {
    console.error('Error retrieving status message:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




const MessageSchema = new mongoose.Schema({
  text: String,
  selectedOption: String,  // Add this line if you have an option associated with each message
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Assuming you have a 'messages' collection in your MongoDB

app.post('/update-status', async (req, res) => {
  try {
    const { name, status } = req.body;

    // Find the existing status for the given name
    let existingStatus = await Status.findOne({ name });

    if (existingStatus) {
      // If status exists, update it
      existingStatus.status = status;
      existingStatus = await existingStatus.save();
      console.log('Status updated:', existingStatus);
    } else {
      // If status does not exist, create a new one
      const newStatus = new Status({ name, status });
      existingStatus = await newStatus.save();
      console.log('Status created:', existingStatus);
    }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// GET method to retrieve name
app.get('/get-name', async (req, res) => {
  try {
    // Assuming you have a 'details' collection in your MongoDB
    const latestDetails = await Details.findOne().sort({ createdAt: -1 });

    if (latestDetails) {
      console.log('Name retrieved:', latestDetails.name);
      res.json({ success: true, name: latestDetails.name });
    } else {
      console.log('No name found');
      res.status(404).json({ success: false, message: 'Name not found' });
    }
  } catch (error) {
    console.error('Error retrieving name:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/get-status-message', async (req, res) => {
  try {
    const latestStatus = await Status.findOne().sort({ createdAt: -1 });

    if (latestStatus) {
      console.log('Status message retrieved:', latestStatus.status);
      res.json({ success: true, message: latestStatus.status });
    } else {
      console.log('No status message found');
      res.status(404).json({ success: false, message: 'Status message not found' });
    }
  } catch (error) {
    console.error('Error retrieving status message:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
