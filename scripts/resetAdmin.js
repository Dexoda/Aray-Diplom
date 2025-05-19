const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function resetAdmin() {
  const hash = await bcrypt.hash('admin123', 10);
  await User.updateOne(
    { email: 'admin@example.com' },
    { $set: { password: hash, isAdmin: true } },
    { upsert: true }
  );
  console.log('Admin password reset!');
  mongoose.disconnect();
}

resetAdmin();