import { PerformanceReview } from '../models/PerformanceReview.js';
import { User } from '../models/User.js';

/**
 * Recalculates the average rating for a trainer and updates their User document.
 * This is called automatically whenever a review is added or removed.
 * @param {string} trainerId 
 */
export const updateTrainerAverageRating = async (trainerId) => {
    const stats = await PerformanceReview.aggregate([
        { $match: { trainerId: trainerId } },
        { 
            $group: {
                _id: '$trainerId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    const averageRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;

    await User.findByIdAndUpdate(trainerId, {
        'trainerProfile.averageRating': averageRating,
        'trainerProfile.reviewCount': reviewCount
    });

    return { averageRating, reviewCount };
};

/**
 * Submits a new review. Throws an error if the user already reviewed this trainer for this session.
 */
export const createReview = async (reviewData) => {
    // Note: The unique index on reviewerId + sessionId + trainerId in the DB 
    // will automatically throw an E11000 duplicate key error if this already exists.
    const review = new PerformanceReview(reviewData);
    await review.save();

    // Trigger background calculation to update the trainer's aggregate score
    await updateTrainerAverageRating(review.trainerId);

    return review;
};

/**
 * Gets paginated reviews for a specific trainer.
 */
export const getTrainerReviews = async (trainerId, limit = 10, skip = 0) => {
    return await PerformanceReview.find({ trainerId })
        .populate('reviewerId', 'name role')
        .populate('classId', 'batchId schedule status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Gets paginated reviews for all trainers (Admin view).
 */
export const getAllReviews = async (limit = 20, skip = 0) => {
    return await PerformanceReview.find()
        .populate('trainerId', 'name')
        .populate('reviewerId', 'name role')
        .populate('classId', 'batchId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};
