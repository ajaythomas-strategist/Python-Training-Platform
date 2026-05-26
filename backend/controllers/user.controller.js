// backend/controllers/user.controller.js
import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';
import { Class } from '../models/Class.js';
import * as xlsx from 'xlsx';

const generateDefaultPassword = (name, phone) => {
    const firstName = name ? name.split(' ')[0] : 'User';
    const phoneStr = phone ? phone.toString().trim() : '';
    const last4 = phoneStr.length >= 4 ? phoneStr.slice(-4) : '1234';
    return `${firstName}@${last4}`;
};

// @desc    Get all users
// @route   GET /api/users
// @access  Protected (SuperAdmin/Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Protected (SuperAdmin/Admin)
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, role, password, phone, gender, photo } = req.body;
    const user = await User.create({
        name,
        email,
        role,
        passwordHash: password || generateDefaultPassword(name, phone),
        phone,
        gender,
        photo,
    });
    // The pre-save hook will hash password
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.status(201).json(userObj);
});

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Protected (SuperAdmin/Admin)
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };
    // If password is being updated, store in passwordHash to trigger hashing
    if (updates.password) {
        updates.passwordHash = updates.password;
        delete updates.password;
    }
    const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    }).select('-passwordHash');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Protected (SuperAdmin/Admin)
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
});

// @desc    Bulk delete users by IDs
// @route   DELETE /api/users/bulk
// @access  Protected (SuperAdmin/Admin)
export const deleteUsersBulk = asyncHandler(async (req, res) => {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'No user IDs provided for deletion' });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });
    res.json({ message: `Successfully deleted ${result.deletedCount} users.`, deletedCount: result.deletedCount });
});

// @desc    Bulk create users and auto-create classes for students
// @route   POST /api/users/bulk
// @access  Protected (SuperAdmin/Admin)
export const bulkUploadUsers = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { roleFilter } = req.body;

    let rawUsers = [];
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        rawUsers = xlsx.utils.sheet_to_json(worksheet);
    } catch (err) {
        return res.status(400).json({ message: 'Failed to parse Excel file', error: err.message });
    }

    if (!rawUsers || !Array.isArray(rawUsers)) {
        return res.status(400).json({ message: 'Invalid payload: expected an array of users' });
    }

    const users = rawUsers.map((row) => {
        const mappedRole =
            row.Role || row.role || (roleFilter === 'All' ? 'Student' : roleFilter) || 'Student';
        return {
            name: row.Name || row.name,
            email: row.Email || row.email,
            role: mappedRole,
            password: row.Password || row.password,
            phone: row.Phone || row.phone || '9999999999',
            gender: row.Gender || row.gender || 'Male',
            batch: row.Batch || row.batch,
            department:
                row.Department || row.department || (mappedRole === 'Student' ? 'BCA' : undefined),
            designation: row.Designation || row.designation,
        };
    });

    const createdUsers = [];
    const errors = [];

    for (let i = 0; i < users.length; i++) {
        const userData = users[i];
        try {
            // Auto-create class if it's a student and provided a batch
            if (userData.role === 'Student' && userData.batch) {
                const existingClass = await Class.findOne({ className: userData.batch });
                if (!existingClass) {
                    await Class.create({
                        className: userData.batch,
                        status: 'Upcoming',
                        assignedTrainer: null,
                        assignedLab: null,
                    });
                }
            }

            const user = await User.create({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                passwordHash: userData.password || generateDefaultPassword(userData.name, userData.phone),
                phone: userData.phone,
                gender: userData.gender,
                batch: userData.batch,
                department: userData.department,
                designation: userData.designation,
            });

            const userObj = user.toObject();
            delete userObj.passwordHash;
            createdUsers.push(userObj);
        } catch (err) {
            errors.push({ index: i, data: userData, error: err.message });
        }
    }

    res.status(201).json({
        message: `Successfully uploaded ${createdUsers.length} users.`,
        created: createdUsers.length,
        errors,
    });
});
