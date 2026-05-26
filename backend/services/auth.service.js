import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Register a new user
 */
export const register = async (userData) => {
  const { name, email, password, role, batch, department, phone, gender, photo } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Set up profiles based on role
  let studentProfile = null;
  let trainerProfile = null;

  if (role === 'Student') {
    studentProfile = { batch: batch || null };
  } else if (role === 'Trainer' || role === 'Co-Trainer') {
    trainerProfile = { department: department || null };
  }

  const user = await User.create({
    name,
    email,
    role,
    passwordHash: password, // User model pre-save hook will hash it
    phone,
    gender,
    photo,
    studentProfile,
    trainerProfile
  });

  // Generate JWT token
  const payload = {
    id: user._id,
    role: user.role
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_key', { 
    expiresIn: '24h' 
  });

  const userObject = user.toObject();
  delete userObject.passwordHash;

  return { user: userObject, token };
};

/**
 * Handle user login and JWT generation
 */
export const login = async ({ email, password }) => {
  // 1. Find the user by email or handle dummy 'superadmin' username
  const searchEmail = email === 'superadmin' ? 'superadmin@example.com' : email;
  const user = await User.findOne({ email: searchEmail });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Compare the provided password with the hashed password in DB
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate a JWT token
  const payload = {
    id: user._id,
    role: user.role
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_key', { 
    expiresIn: '24h' 
  });

  // 4. Return user object (excluding password hash) and the token
  const userObject = user.toObject();
  delete userObject.passwordHash;

  return { user: userObject, token };
};

/**
 * Get current user profile
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
