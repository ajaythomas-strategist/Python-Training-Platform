// backend/routes/auth.routes.js
import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public endpoints
router.post('/register', register);
router.post('/login', login);

// Protected endpoint – returns current user's profile
router.get('/me', protect, getProfile);

export default router;
