import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import classRoutes from './routes/class.routes.js';
import sessionRoutes from './routes/session.routes.js';
import labRoutes from './routes/lab.routes.js';
import guidelineRoutes from './routes/guideline.routes.js';
import taskRoutes from './routes/task.routes.js';
import reviewRoutes from './routes/review.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import './models/Session.js'; // Registers Session schema with Mongoose for populate()
import { protect } from './middlewares/auth.middleware.js';

dotenv.config({ quiet: true });

const app = express();

// Global middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (example)
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/guidelines', guidelineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check (optional)
app.get('/health', (_, res) => res.send({ status: 'OK' }));

// 404 Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: `Route Not Found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // If the error message is about invalid credentials, we can enforce a 401 status
    const finalStatus = err.message === 'Invalid credentials' ? 401 : statusCode;

    res.status(finalStatus).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

export default app;
