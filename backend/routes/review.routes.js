import express from 'express';
import { createReview, getTrainerReviews, getAllReviews } from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { cache } from '../middlewares/cache.middleware.js';

const router = express.Router();

// All review routes require authentication
router.use(protect);

// @route   POST /api/reviews
router.post('/', createReview);

// @route   GET /api/reviews/trainer/:trainerId
router.get('/trainer/:trainerId', cache(30), getTrainerReviews);

// @route   GET /api/reviews
// @access  SuperAdmin / Admin
router.get('/', cache(30), authorizeRoles('SuperAdmin', 'Admin'), getAllReviews);

export default router;
