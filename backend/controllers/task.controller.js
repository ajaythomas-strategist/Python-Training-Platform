import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import { Class } from '../models/Class.js';
import * as taskService from '../services/task.service.js';

const createSchema = Joi.object({
    classId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(),
    role: Joi.string().valid('Admin', 'Trainer', 'Co-Trainer').required(),
    text: Joi.string().trim().min(3).max(500).required(),
    dueDate: Joi.date().iso().allow(null, '').optional(),
});

// @desc    Get tasks for a class (optionally filtered by role query param)
// @route   GET /api/tasks?classId=xxx&role=Trainer
// @access  Protected
export const getTasks = asyncHandler(async (req, res) => {
    const { classId, role } = req.query;
    if (!classId) return res.status(400).json({ message: 'classId query param is required' });
    const tasks = await taskService.getTasksByClass(classId, role || null);
    res.json(tasks);
});

// @desc    Get my pending tasks (trainer/co-trainer's own classes)
// @route   GET /api/tasks/my-tasks
// @access  Trainer / Co-Trainer
export const getMyTasks = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;

    // Find all classes this user is assigned to
    const classes = await Class.find({
        $or: [{ assignedTrainer: _id }, { coTrainers: _id }],
    }).select('_id');

    const classIds = classes.map((c) => c._id);
    const tasks = await taskService.getMyTasks(role, classIds);
    res.json(tasks);
});

// @desc    Create a task for a class
// @route   POST /api/tasks
// @access  SuperAdmin / Admin
export const createTask = asyncHandler(async (req, res) => {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const task = await taskService.createTask({ ...value, createdBy: req.user._id });
    res.status(201).json(task);
});

// @desc    Mark a task as completed
// @route   PUT /api/tasks/:id/complete
// @access  Protected (any role who owns the task)
export const completeTask = asyncHandler(async (req, res) => {
    const task = await taskService.completeTask(req.params.id, req.user._id);
    res.json(task);
});

// @desc    Reopen a task
// @route   PUT /api/tasks/:id/reopen
// @access  SuperAdmin / Admin
export const reopenTask = asyncHandler(async (req, res) => {
    const task = await taskService.reopenTask(req.params.id);
    res.json(task);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  SuperAdmin / Admin
export const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
});

// @desc    Get task summary for a class
// @route   GET /api/tasks/summary?classId=xxx
// @access  Protected
export const getTaskSummary = asyncHandler(async (req, res) => {
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ message: 'classId query param is required' });
    const summary = await taskService.getTaskSummaryByClass(classId);
    res.json(summary);
});
