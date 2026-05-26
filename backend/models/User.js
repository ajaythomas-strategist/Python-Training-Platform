import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Embedded Sub-Schema for Students
const studentProfileSchema = new mongoose.Schema({
  batch: { 
    type: String, 
    trim: true, 
    default: null 
  },
  highSchool: { 
    type: String, 
    trim: true, 
    default: null 
  },
  comments: { 
    type: String, 
    trim: true, 
    default: "" 
  }
}, { _id: false });

// 2. Embedded Sub-Schema for Trainers & Co-Trainers
const trainerProfileSchema = new mongoose.Schema({
  department: { 
    type: String, 
    trim: true, 
    default: null 
  },
  availability: { 
    type: String, 
    enum: ['Available', 'Busy', 'On Leave'], 
    default: 'Available' 
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { _id: false });

// 3. Core Users Schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    trim: true, 
    default: null 
  },
  role: { 
    type: String, 
    required: [true, 'Role is required'], 
    enum: ['SuperAdmin', 'Admin', 'Trainer', 'Co-Trainer', 'Student'] 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'], 
    default: 'Other' 
  },
  photo: { 
    type: String, 
    default: 'https://i.pravatar.cc/150' 
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  needsPasswordReset: { 
    type: Boolean, 
    default: true // Default true to force reset on first login
  },
  
  // Optional Embedded Profiles
  studentProfile: {
    type: studentProfileSchema,
    default: null
  },
  trainerProfile: {
    type: trainerProfileSchema,
    default: null
  }
}, { 
  timestamps: true 
});

// 4. Performance Indexes
userSchema.index({ role: 1 });
userSchema.index({ 'studentProfile.batch': 1 }, { sparse: true });

// 5. Pre-Save Hook to Hash Passwords
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// 6. Schema Method to Verify Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
export default User;
