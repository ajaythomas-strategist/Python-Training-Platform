import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
        className: {
            type: String,
            required: [true, 'Class name is required'],
            trim: true,
            unique: true,
        },
        assignedTrainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        coTrainers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        assignedLab: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lab',
            required: false,
        },
        status: {
            type: String,
            enum: ['Active', 'Upcoming', 'Completed'],
            default: 'Upcoming',
        },
        startDate: {
            type: Date,
            required: false,
        },
        completedTasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Guideline',
            },
        ],
    },
    {
        timestamps: true,
    },
);

// Note: className already has a unique: true index auto-created
classSchema.index({ assignedTrainer: 1 });
classSchema.index({ status: 1 });

export const Class = mongoose.model('Class', classSchema);
export default Class;
