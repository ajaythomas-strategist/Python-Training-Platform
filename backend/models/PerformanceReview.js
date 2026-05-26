import mongoose from 'mongoose';

const performanceReviewSchema = new mongoose.Schema(
    {
        trainerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Trainer ID is required'],
        },
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Reviewer ID is required'],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class ID is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comments: {
            type: String,
            trim: true,
            maxlength: [1000, 'Comments cannot exceed 1000 characters'],
        },
    },
    { timestamps: true }
);

// Prevent a reviewer from submitting multiple reviews for the same trainer in the same class
performanceReviewSchema.index({ reviewerId: 1, classId: 1, trainerId: 1 }, { unique: true });
// Index for fetching reviews for a specific trainer
performanceReviewSchema.index({ trainerId: 1, createdAt: -1 });

export const PerformanceReview = mongoose.model('PerformanceReview', performanceReviewSchema);
export default PerformanceReview;
