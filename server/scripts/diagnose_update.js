const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function testUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a user (any user)
    const user = await User.findOne();
    if (!user) {
      console.log('No user found to test with');
      process.exit(1);
    }

    console.log('Testing update for user:', user.email);
    console.log('Current user data:', JSON.stringify(user, null, 2));

    // Try a simple update similar to what the controller does
    user.location = 'Test Location';
    user.bio = 'Test Bio';
    user.skillsWanted = [{ title: 'Fixing Bugs', description: 'Testing the sync' }];

    try {
      await user.save();
      console.log('Update successful');
    } catch (saveError) {
      console.error('Save failed:', saveError);
    }

    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

testUpdate();
