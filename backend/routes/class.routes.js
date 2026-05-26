import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { cache } from '../middlewares/cache.middleware.js';
import { createClass, getClasses, updateClass } from '../controllers/class.controller.js';

const router = express.Router();

router
    .route('/')
    .get(protect, cache(60), getClasses)
    .post(protect, authorizeRoles('Admin', 'SuperAdmin'), createClass);

router.route('/:id').put(protect, authorizeRoles('Admin', 'SuperAdmin'), updateClass);

export default router;
