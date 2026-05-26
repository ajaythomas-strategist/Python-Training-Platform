import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class reference is required'],
        },
        date: {
            type: Date,
            required: [true, 'Session date is required'],
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
            match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'],
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            match: [/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'],
        },
        topicsCovered: {
            type: String,
            trim: true,
            default: '',
        },
        // Transfer support - if session was handed over to another trainer
        transferredTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        transferredCoTrainerTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled'],
            default: 'Scheduled',
        },
    },
    { timestamps: true },
);

// Compound index for fast class-level session queries
sessionSchema.index({ classId: 1, date: 1 });
sessionSchema.index({ date: 1 });

export const Session = mongoose.model('Session', sessionSchema);
export default Session;
