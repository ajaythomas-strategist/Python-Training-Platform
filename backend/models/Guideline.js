import mongoose from 'mongoose';

const guidelineSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, 'Target role is required'],
            enum: ['Admin', 'Trainer', 'Co-Trainer', 'Student', 'All'],
        },
        text: {
            type: String,
            required: [true, 'Guideline text is required'],
            trim: true,
            maxlength: [500, 'Guideline cannot exceed 500 characters'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

guidelineSchema.index({ role: 1, isActive: 1 });

export const Guideline = mongoose.model('Guideline', guidelineSchema);
export default Guideline;
