const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function testUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the user from the screenshot
    const user = await User.findOne({ name: /ayush/i });
    if (!user) {
      console.log('User ayush not found');
      process.exit(1);
    }

    console.log('Testing update for user:', user.email);

    user.location = 'vadodara';
    user.bio = 'boxing teacher';
    user.skillsWanted = [{ title: 'okay', description: '' }];

    try {
      await user.save();
      console.log('Update successful! No validation errors.');
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
