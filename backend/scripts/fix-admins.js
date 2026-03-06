// Fix: pass PLAIN text password — the User model's pre('save') hook hashes it
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/modules/auth/user.model');

const MONGO_URI = process.env.MONGO_URI ||
    'mongodb+srv://dhangardip09_db_user:tr087BUjVWYXvFxh@civicsense-cluster.kojjxs3.mongodb.net/?appName=civicsense-cluster';

async function fixAdmins() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete double-hashed bad accounts
    await User.deleteOne({ email: 'admin@civicsense.com' });
    await User.deleteOne({ email: 'officer@civicsense.com' });
    console.log('Removed bad accounts');

    // Create with PLAIN password — the pre('save') hook will hash it correctly
    await User.create({ name: 'Admin User', email: 'admin@civicsense.com', password: 'Admin@123', role: 'admin' });
    await User.create({ name: 'Officer One', email: 'officer@civicsense.com', password: 'Admin@123', role: 'officer' });

    console.log('SUCCESS! Accounts recreated with correct password hash:');
    console.log('  Admin:   admin@civicsense.com   / Admin@123');
    console.log('  Officer: officer@civicsense.com / Admin@123');

    await mongoose.connection.close();
}

fixAdmins().catch(err => { console.error(err); process.exit(1); });
