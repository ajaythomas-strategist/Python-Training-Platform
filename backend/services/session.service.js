import { Session } from '../models/Session.js';
import { Class } from '../models/Class.js';

// Create a new session for a class
export const createSession = async (sessionData) => {
    const { classId, date, startTime, endTime } = sessionData;

    // Verify the class exists
    const parentClass = await Class.findById(classId);
    if (!parentClass) throw new Error('Class not found');

    // Check for time-slot conflicts within the same class on the same day
    const sessionDate = new Date(date);
    const startOfDay = new Date(sessionDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(sessionDate.setHours(23, 59, 59, 999));

    const existing = await Session.findOne({
        classId,
        date: { $gte: startOfDay, $lte: endOfDay },
        startTime,
    });
    if (existing) {
        throw new Error('A session in this class already exists for the same date and start time');
    }

    const session = new Session(sessionData);
    await session.save();
    return session.populate([
        { path: 'classId', select: 'className' },
        { path: 'transferredTo', select: 'name' },
        { path: 'transferredCoTrainerTo', select: 'name' },
    ]);
};

// Get all sessions for a class
export const getSessionsByClass = async (classId) => {
    const parentClass = await Class.findById(classId);
    if (!parentClass) throw new Error('Class not found');

    return await Session.find({ classId })
        .sort({ date: 1, startTime: 1 })
        .populate('transferredTo', 'name')
        .populate('transferredCoTrainerTo', 'name');
};

// Get all sessions
export const getAllSessions = async () => {
    return await Session.find()
        .sort({ classId: 1, date: 1, startTime: 1 })
        .populate('transferredTo', 'name')
        .populate('transferredCoTrainerTo', 'name');
};

// Get all sessions for a specific trainer (personal calendar)
export const getSessionsByTrainer = async (userId) => {
    // Find classes where this user is assignedTrainer or coTrainer
    const trainerClasses = await Class.find({
        $or: [{ assignedTrainer: userId }, { coTrainers: userId }],
    }).select('_id className');

    const classIds = trainerClasses.map((c) => c._id);

    return await Session.find({ classId: { $in: classIds }, status: { $ne: 'Cancelled' } })
        .sort({ date: 1, startTime: 1 })
        .populate('classId', 'className')
        .populate('transferredTo', 'name')
        .populate('transferredCoTrainerTo', 'name');
};

// Get upcoming sessions (today or later) — with full class details for dashboard table
export const getUpcomingSessions = async (userId = null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter = { date: { $gte: today }, status: 'Scheduled' };

    let allowedClassIds = null;
    if (userId) {
        const trainerClasses = await Class.find({
            $or: [{ assignedTrainer: userId }, { coTrainers: userId }],
        }).select('_id');
        allowedClassIds = trainerClasses.map((c) => c._id);
        filter.classId = { $in: allowedClassIds };
    }

    // Fetch sessions with full class, trainer, coTrainer, and lab details
    const sessions = await Session.find(filter)
        .sort({ date: 1, startTime: 1 })
        .populate({
            path: 'classId',
            select: 'className assignedTrainer coTrainers assignedLab',
            populate: [
                { path: 'assignedTrainer', select: 'name' },
                { path: 'coTrainers', select: 'name' },
                { path: 'assignedLab', select: 'name' },
            ],
        })
        .populate('transferredTo', 'name')
        .populate('transferredCoTrainerTo', 'name');

    if (!sessions.length) return [];

    // Get all unique classNames from the sessions to count students per class
    const classNames = [...new Set(
        sessions.map((s) => s.classId?.className).filter(Boolean)
    )];

    const { User } = await import('../models/User.js');
    const studentCounts = await User.aggregate([
        {
            $match: {
                role: 'Student',
                'studentProfile.batch': { $in: classNames },
            },
        },
        {
            $group: {
                _id: '$studentProfile.batch',
                count: { $sum: 1 },
            },
        },
    ]);

    const countMap = Object.fromEntries(studentCounts.map((r) => [r._id, r.count]));

    // Attach studentCount to each session
    return sessions.map((s) => {
        const obj = s.toObject();
        obj.studentCount = countMap[s.classId?.className] ?? 0;
        return obj;
    });
};

// Update a session by ID
export const updateSession = async (id, updateData) => {
    const session = await Session.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
        .populate('classId', 'className')
        .populate('transferredTo', 'name')
        .populate('transferredCoTrainerTo', 'name');

    if (!session) throw new Error('Session not found');
    return session;
};

// Delete a session
export const deleteSession = async (id) => {
    const session = await Session.findByIdAndDelete(id);
    if (!session) throw new Error('Session not found');
    return session;
};
