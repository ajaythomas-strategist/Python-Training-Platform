import express from 'express';
import {
    getLabs,
    getMetrics,
    getLabById,
    createLab,
    updateLab,
    setMaintenanceStatus,
    deleteLab,
} from '../controllers/lab.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

// All lab routes require authentication
router.use(protect);

// Read — accessible by all authenticated users
router.get('/', getLabs);
router.get('/metrics', getMetrics);
router.get('/:id', getLabById);

// Write — SuperAdmin + Admin only
router.post('/', authorizeRoles('SuperAdmin', 'Admin'), createLab);
router.put('/:id', authorizeRoles('SuperAdmin', 'Admin'), updateLab);
router.put('/:id/maintenance', authorizeRoles('SuperAdmin', 'Admin'), setMaintenanceStatus);
router.delete('/:id', authorizeRoles('SuperAdmin'), deleteLab);

export default router;
