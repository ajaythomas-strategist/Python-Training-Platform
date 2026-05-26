import express from 'express';
import { markAttendance, getSessionAttendance, getAllAttendance } from '../controllers/attendance.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);

// Trainers and Admins can mark attendance
router.post('/', authorizeRoles('SuperAdmin', 'Admin', 'Trainer', 'Co-Trainer'), markAttendance);

// Anyone with access to the session can view attendance
router.get('/session/:sessionId', getSessionAttendance);

// Get all attendance records for overall reports
router.get('/', getAllAttendance);

export default router;
