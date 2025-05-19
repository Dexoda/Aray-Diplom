const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Create admin function
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin' });
    
    if (existingAdmin) {
      // Update the existing admin
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.updateOne(
        { email: 'admin' },
        { 
          $set: { 
            password: hashedPassword,
            isAdmin: true,
            name: 'admin'
          } 
        }
      );
      console.log('Admin password updated successfully');
    } else {
      // Create a new admin
      const hashedPassword = await bcrypt.hash('admin', 10);
      const newAdmin = new User({
        name: 'admin',
        email: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      
      await newAdmin.save();
      console.log('New admin created successfully');
    }
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating/updating admin:', error);
    mongoose.disconnect();
  }
};

// Execute the function
createAdmin();