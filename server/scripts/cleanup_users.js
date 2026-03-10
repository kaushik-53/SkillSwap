const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function cleanUp() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.deleteMany({ email: { $exists: false } });
    console.log('Deleted', result.deletedCount, 'invalid users');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanUp();
