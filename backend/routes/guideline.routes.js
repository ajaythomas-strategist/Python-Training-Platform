import express from 'express';
import { getGuidelines, createGuideline, deleteGuideline } from '../controllers/guideline.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);

// All authenticated users can read guidelines (filtered by their role in the controller)
router.get('/', getGuidelines);

// Only SuperAdmin / Admin can create or delete guidelines
router.post('/', authorizeRoles('SuperAdmin', 'Admin'), createGuideline);
router.delete('/:id', authorizeRoles('SuperAdmin', 'Admin'), deleteGuideline);

export default router;
