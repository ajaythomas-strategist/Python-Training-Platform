import express from 'express';
import {
    createSession,
    getSessionsByClass,
    getSessionsByTrainer,
    getUpcomingSessions,
    getAllSessions,
    updateSession,
    deleteSession,
} from '../controllers/session.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

// All session routes require authentication
router.use(protect);

// Accessible by all authenticated users
router.get('/class/:classId', getSessionsByClass);
router.get('/trainer/:userId', getSessionsByTrainer);
router.get('/upcoming', getUpcomingSessions);
router.get('/all', getAllSessions);

// Admin / SuperAdmin / Trainer manage sessions
router.post('/', authorizeRoles('SuperAdmin', 'Admin', 'Trainer'), createSession);
router.put('/:id', authorizeRoles('SuperAdmin', 'Admin', 'Trainer'), updateSession);
router.delete('/:id', authorizeRoles('SuperAdmin', 'Admin'), deleteSession);

export default router;
