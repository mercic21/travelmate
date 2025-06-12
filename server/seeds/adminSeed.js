const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const adminUser = {
  name: 'Admin User',
  email: 'admin@travelmate.com',
  password: 'Admin@123',
  isAdmin: true
};

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new admin user
    const newAdmin = await User.create(adminUser);
    console.log('Admin user created:', {
      id: newAdmin._id,
      email: newAdmin.email,
      isAdmin: newAdmin.isAdmin
    });
    process.exit(0);

  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
