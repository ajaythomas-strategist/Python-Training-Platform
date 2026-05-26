import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ quiet: true });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/python-platform';

const superAdmin = {
    name: 'Super Admin',
    email: 'admin@platform.com',
    phone: '123456',
    role: 'SuperAdmin',
    gender: 'Other',
    passwordHash: 'Admin@1234', // will be hashed by pre-save hook
    needsPasswordReset: false,
};

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB:', MONGO_URI);

    const existing = await User.findOne({ email: superAdmin.email });
    if (existing) {
        console.log(`⚠️  User "${superAdmin.email}" already exists. Skipping.`);
    } else {
        await User.create(superAdmin);
        console.log(`✅  SuperAdmin created:`);
        console.log(`    Email   : ${superAdmin.email}`);
        console.log(`    Password: Admin@1234`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
