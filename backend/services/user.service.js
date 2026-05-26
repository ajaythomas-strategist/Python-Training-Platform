import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Fetch all users based on optional filters
 */
export const getUsers = async (filters = {}) => {
  const query = {};
  if (filters.role && filters.role !== 'All') {
    query.role = filters.role;
  }
  // Retrieve users, excluding passwords
  return await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
};

/**
 * Create a single new user
 */
export const createUser = async (userData) => {
  // If no password provided, default to their phone number, or a fallback 'welcome123'
  const defaultPassword = userData.phone || 'welcome123';
  
  const newUser = new User({
    ...userData,
    passwordHash: defaultPassword // The pre-save hook in User.js will automatically hash this!
  });

  await newUser.save();
  
  const userObject = newUser.toObject();
  delete userObject.passwordHash;
  return userObject;
};

/**
 * Update an existing user's profile
 */
export const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  // Update root fields
  if (updateData.name) user.name = updateData.name;
  if (updateData.email) user.email = updateData.email;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.gender) user.gender = updateData.gender;

  // Update embedded profiles
  if (user.role === 'Student' && updateData.studentProfile) {
    user.studentProfile = { ...user.studentProfile, ...updateData.studentProfile };
  } else if ((user.role === 'Trainer' || user.role === 'Co-Trainer') && updateData.trainerProfile) {
    user.trainerProfile = { ...user.trainerProfile, ...updateData.trainerProfile };
  }

  await user.save();
  
  const userObject = user.toObject();
  delete userObject.passwordHash;
  return userObject;
};

/**
 * Suspend/Delete a user
 */
export const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) throw new Error('User not found');
  return deletedUser;
};

/**
 * Bulk upload multiple users (e.g. from CSV)
 */
export const bulkUploadUsers = async (usersArray) => {
  const salt = await bcrypt.genSalt(10);

  // Prepare users for fast insertMany
  const preparedUsers = await Promise.all(usersArray.map(async (u) => {
    const defaultPassword = u.phone || 'welcome123';
    const hash = await bcrypt.hash(defaultPassword, salt); // Hash manually for bulk insert bypass
    
    return {
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role || 'Student',
      gender: u.gender || 'Other',
      passwordHash: hash,
      needsPasswordReset: true,
      studentProfile: u.role === 'Student' ? { batch: u.batch } : undefined,
      trainerProfile: (u.role === 'Trainer' || u.role === 'Co-Trainer') ? { department: u.department } : undefined
    };
  }));

  const result = await User.insertMany(preparedUsers, { ordered: false });
  return result;
};
