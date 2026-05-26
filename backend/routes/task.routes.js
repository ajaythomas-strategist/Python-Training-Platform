import express from 'express';
import {
    getTasks,
    getMyTasks,
    createTask,
    completeTask,
    reopenTask,
    deleteTask,
    getTaskSummary,
} from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);

// Read
router.get('/', getTasks);                                                    // ?classId=&role=
router.get('/my-tasks', getMyTasks);                                          // Trainer/Co-Trainer personal view
router.get('/summary', getTaskSummary);                                       // ?classId=

// Mutations
router.post('/', authorizeRoles('SuperAdmin', 'Admin'), createTask);
router.put('/:id/complete', completeTask);                                    // Any authenticated user
router.put('/:id/reopen', authorizeRoles('SuperAdmin', 'Admin'), reopenTask);
router.delete('/:id', authorizeRoles('SuperAdmin', 'Admin'), deleteTask);

export default router;
