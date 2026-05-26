import { Attendance } from '../models/Attendance.js';
import { getIo } from '../socket.js';

/**
 * Marks attendance for a student and instantly broadcasts the update via WebSocket.
 */
export const markAttendance = async (data) => {
    // Upsert prevents duplicate attendance records for the same student in the same session.
    // If it exists, update it. If not, create it.
    const attendance = await Attendance.findOneAndUpdate(
        { studentId: data.studentId, sessionId: data.sessionId },
        { ...data },
        { new: true, upsert: true, runValidators: true }
    ).populate('studentId', 'name role studentProfile');

    // Emit live event to everyone connected to this session's room
    try {
        const io = getIo();
        io.to(data.sessionId.toString()).emit('attendance_update', attendance);
    } catch (err) {
        console.error('WebSocket emit failed, but DB was updated:', err.message);
    }

    return attendance;
};

/**
 * Retrieves all attendance records for a given session.
 */
export const getSessionAttendance = async (sessionId) => {
    return await Attendance.find({ sessionId }).populate('studentId', 'name email role studentProfile');
};

/**
 * Retrieves all attendance records.
 */
export const getAllAttendance = async () => {
    return await Attendance.find({});
};
