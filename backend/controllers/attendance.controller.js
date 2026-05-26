import asyncHandler from 'express-async-handler';
import * as attendanceService from '../services/attendance.service.js';
import { markAttendanceSchema } from '../validations/attendance.validation.js';

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Protected (Admin / Trainer / Co-Trainer)
export const markAttendance = asyncHandler(async (req, res) => {
    const { error, value } = markAttendanceSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const attendance = await attendanceService.markAttendance(value);
    res.status(200).json(attendance); // 200 OK because it handles both Create and Update (Upsert)
});

// @desc    Get all attendance records for a specific session
// @route   GET /api/attendance/session/:sessionId
// @access  Protected
export const getSessionAttendance = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const records = await attendanceService.getSessionAttendance(sessionId);
    res.json(records);
});

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Protected
export const getAllAttendance = asyncHandler(async (req, res) => {
    const records = await attendanceService.getAllAttendance();
    res.json(records);
});
