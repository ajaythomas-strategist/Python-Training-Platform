import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student ID is required'],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class ID is required'],
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            required: [true, 'Session ID is required'],
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Excused'],
            default: 'Present',
        },
        checkInTime: {
            type: Date,
            default: Date.now,
        },
        checkOutTime: {
            type: Date,
            default: null,
        },
        remarks: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

// Prevent multiple attendance records for the same student in the same session
attendanceSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });

// Index for quickly fetching attendance for a specific session
attendanceSchema.index({ sessionId: 1, status: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
