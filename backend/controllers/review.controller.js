import asyncHandler from 'express-async-handler';
import * as reviewService from '../services/review.service.js';
import { createReviewSchema } from '../validations/review.validation.js';

// @desc    Submit a new performance review
// @route   POST /api/reviews
// @access  Protected
export const createReview = asyncHandler(async (req, res) => {
    const { error, value } = createReviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const review = await reviewService.createReview({
            ...value,
            reviewerId: req.user._id,
        });
        res.status(201).json(review);
    } catch (err) {
        // E11000 is the MongoDB duplicate key error code
        if (err.code === 11000) {
            return res.status(409).json({ message: 'You have already submitted a review for this trainer in this session.' });
        }
        throw err;
    }
});

// @desc    Get paginated reviews for a specific trainer
// @route   GET /api/reviews/trainer/:trainerId
// @access  Protected
export const getTrainerReviews = asyncHandler(async (req, res) => {
    const { trainerId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = parseInt(req.query.skip, 10) || 0;

    const reviews = await reviewService.getTrainerReviews(trainerId, limit, skip);
    res.json(reviews);
});

// @desc    Get all reviews paginated (Admin view)
// @route   GET /api/reviews
// @access  SuperAdmin / Admin
export const getAllReviews = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = parseInt(req.query.skip, 10) || 0;

    const reviews = await reviewService.getAllReviews(limit, skip);
    res.json(reviews);
});
