import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class is required'],
        },
        // Target role within the class (Admin, Trainer, Co-Trainer)
        role: {
            type: String,
            required: [true, 'Target role is required'],
            enum: ['Admin', 'Trainer', 'Co-Trainer'],
        },
        text: {
            type: String,
            required: [true, 'Task text is required'],
            trim: true,
            maxlength: [500, 'Task cannot exceed 500 characters'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed'],
            default: 'Pending',
        },
        completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

taskSchema.index({ classId: 1, role: 1 });
taskSchema.index({ status: 1 });

export const Task = mongoose.model('Task', taskSchema);
export default Task;
