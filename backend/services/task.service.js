import { Task } from '../models/Task.js';

/**
 * Get all tasks for a class, optionally filtered by role.
 */
export const getTasksByClass = async (classId, role = null) => {
    const filter = { classId };
    if (role) filter.role = role;
    return await Task.find(filter)
        .sort({ role: 1, createdAt: 1 })
        .populate('completedBy', 'name')
        .populate('createdBy', 'name');
};

/**
 * Get tasks assigned to the logged-in user's role within their classes.
 * Used for the "my tasks" view on the dashboard.
 */
export const getMyTasks = async (userRole, classIds) => {
    return await Task.find({
        classId: { $in: classIds },
        role: userRole,
        status: 'Pending',
    })
        .sort({ dueDate: 1, createdAt: 1 })
        .populate('classId', 'className')
        .populate('createdBy', 'name');
};

/**
 * Create a new task for a class.
 */
export const createTask = async ({ classId, role, text, createdBy, dueDate }) => {
    const task = new Task({ classId, role, text, createdBy, dueDate: dueDate || null });
    await task.save();
    return task.populate([
        { path: 'classId', select: 'className' },
        { path: 'createdBy', select: 'name' },
    ]);
};

/**
 * Mark a task as completed.
 */
export const completeTask = async (id, userId) => {
    const task = await Task.findByIdAndUpdate(
        id,
        { status: 'Completed', completedBy: userId, completedAt: new Date() },
        { new: true, runValidators: true },
    ).populate('completedBy', 'name');

    if (!task) throw new Error('Task not found');
    return task;
};

/**
 * Reopen a completed task (Admin/SuperAdmin only).
 */
export const reopenTask = async (id) => {
    const task = await Task.findByIdAndUpdate(
        id,
        { status: 'Pending', completedBy: null, completedAt: null },
        { new: true },
    );
    if (!task) throw new Error('Task not found');
    return task;
};

/**
 * Delete a task permanently.
 */
export const deleteTask = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new Error('Task not found');
    return task;
};

/**
 * Get task completion summary per class (for dashboard stats).
 */
export const getTaskSummaryByClass = async (classId) => {
    const [total, completed] = await Promise.all([
        Task.countDocuments({ classId }),
        Task.countDocuments({ classId, status: 'Completed' }),
    ]);
    return { total, completed, pending: total - completed };
};
