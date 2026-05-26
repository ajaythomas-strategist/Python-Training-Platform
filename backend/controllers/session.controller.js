import asyncHandler from 'express-async-handler';
import { createSessionSchema, updateSessionSchema } from '../validations/session.validation.js';
import * as sessionService from '../services/session.service.js';

// @desc    Create a session
// @route   POST /api/sessions
// @access  Admin / SuperAdmin
export const createSession = asyncHandler(async (req, res) => {
    const { error, value } = createSessionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const session = await sessionService.createSession(value);
    res.status(201).json(session);
});

// @desc    Get all sessions for a class
// @route   GET /api/sessions/class/:classId
// @access  Protected
export const getSessionsByClass = asyncHandler(async (req, res) => {
    const sessions = await sessionService.getSessionsByClass(req.params.classId);
    res.json(sessions);
});

// @desc    Get all sessions
// @route   GET /api/sessions/all
// @access  Protected
export const getAllSessions = asyncHandler(async (req, res) => {
    const sessions = await sessionService.getAllSessions();
    res.json(sessions);
});

// @desc    Get sessions for a specific trainer (calendar view)
// @route   GET /api/sessions/trainer/:userId
// @access  Protected
export const getSessionsByTrainer = asyncHandler(async (req, res) => {
    const sessions = await sessionService.getSessionsByTrainer(req.params.userId);
    res.json(sessions);
});

// @desc    Get upcoming sessions (for the logged-in trainer or admin)
// @route   GET /api/sessions/upcoming
// @access  Protected
export const getUpcomingSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const role = req.user.role;
    // For Admin/SuperAdmin, return all upcoming sessions; for trainers return only their own
    const sessions = await sessionService.getUpcomingSessions(
        role === 'Admin' || role === 'SuperAdmin' ? null : userId,
    );
    res.json(sessions);
});

// @desc    Update a session
// @route   PUT /api/sessions/:id
// @access  Admin / SuperAdmin / Trainer (for transfers only)
export const updateSession = asyncHandler(async (req, res) => {
    const { error, value } = updateSessionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const session = await sessionService.updateSession(req.params.id, value);
    res.json(session);
});

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Admin / SuperAdmin
export const deleteSession = asyncHandler(async (req, res) => {
    await sessionService.deleteSession(req.params.id);
    res.status(204).send();
});
