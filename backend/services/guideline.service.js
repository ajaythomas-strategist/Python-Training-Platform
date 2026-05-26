import { Guideline } from '../models/Guideline.js';

/**
 * Get all active guidelines, optionally filtered by role.
 * Roles see their own guidelines + 'All' guidelines.
 */
export const getGuidelines = async (userRole = null) => {
    const roleFilter = userRole
        ? { role: { $in: [userRole, 'All'] }, isActive: true }
        : { isActive: true };

    return await Guideline.find(roleFilter)
        .sort({ role: 1, createdAt: 1 })
        .populate('createdBy', 'name role');
};

/**
 * Get guidelines grouped by role (for SuperAdmin management view).
 */
export const getGuidelinesGrouped = async () => {
    const all = await Guideline.find({ isActive: true })
        .sort({ role: 1, createdAt: 1 })
        .populate('createdBy', 'name');

    // Group into { Admin: [...], Trainer: [...], 'Co-Trainer': [...], ... }
    return all.reduce((acc, g) => {
        if (!acc[g.role]) acc[g.role] = [];
        acc[g.role].push(g);
        return acc;
    }, {});
};

/**
 * Create a new guideline.
 */
export const createGuideline = async ({ role, text, createdBy }) => {
    const guideline = new Guideline({ role, text, createdBy });
    await guideline.save();
    return guideline.populate('createdBy', 'name role');
};

/**
 * Soft-delete (deactivate) a guideline.
 */
export const deleteGuideline = async (id) => {
    const guideline = await Guideline.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true },
    );
    if (!guideline) throw new Error('Guideline not found');
    return guideline;
};

/**
 * Permanently hard-delete a guideline (SuperAdmin only).
 */
export const hardDeleteGuideline = async (id) => {
    const guideline = await Guideline.findByIdAndDelete(id);
    if (!guideline) throw new Error('Guideline not found');
    return guideline;
};
