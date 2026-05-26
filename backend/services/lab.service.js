import { Lab } from '../models/Lab.js';

/**
 * Get all labs, with optional status filter
 */
export const getLabs = async (filters = {}) => {
    const query = {};
    if (filters.status && filters.status !== 'All') {
        query.status = filters.status;
    }
    return await Lab.find(query)
        .sort({ name: 1 })
        .populate('assignedAdmin', 'name email');
};

/**
 * Get a single lab by ID
 */
export const getLabById = async (id) => {
    const lab = await Lab.findById(id).populate('assignedAdmin', 'name email');
    if (!lab) throw new Error('Lab not found');
    return lab;
};

/**
 * Create a new lab — enforces unique name via MongoDB index
 */
export const createLab = async (labData) => {
    const existing = await Lab.findOne({ name: labData.name.trim() });
    if (existing) throw new Error(`A lab named "${labData.name}" already exists`);

    const lab = new Lab(labData);
    await lab.save();
    return lab.populate('assignedAdmin', 'name email');
};

/**
 * Update lab fields (general edit)
 */
export const updateLab = async (id, updateData) => {
    // If renaming, check for name collision
    if (updateData.name) {
        const conflict = await Lab.findOne({ name: updateData.name.trim(), _id: { $ne: id } });
        if (conflict) throw new Error(`A lab named "${updateData.name}" already exists`);
    }

    const lab = await Lab.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate('assignedAdmin', 'name email');

    if (!lab) throw new Error('Lab not found');
    return lab;
};

/**
 * Toggle maintenance mode on a lab.
 * When entering maintenance: sets status to 'Maintenance' and stores the schedule.
 * When clearing: sets status back to 'Available' and clears the schedule.
 */
export const setMaintenanceStatus = async (id, maintenanceData) => {
    let updatePayload;

    if (maintenanceData) {
        // Entering maintenance
        updatePayload = {
            status: 'Maintenance',
            maintenance: {
                startDate: maintenanceData.startDate,
                endDate: maintenanceData.endDate,
                reason: maintenanceData.reason || 'Scheduled Maintenance',
            },
        };
    } else {
        // Clearing maintenance — bring back online
        updatePayload = {
            status: 'Available',
            maintenance: { startDate: null, endDate: null, reason: '' },
        };
    }

    const lab = await Lab.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true })
        .populate('assignedAdmin', 'name email');

    if (!lab) throw new Error('Lab not found');
    return lab;
};

/**
 * Delete a lab
 */
export const deleteLab = async (id) => {
    const lab = await Lab.findByIdAndDelete(id);
    if (!lab) throw new Error('Lab not found');
    return lab;
};

/**
 * Return quick availability metrics (for dashboard KPI cards)
 */
export const getAvailabilityMetrics = async () => {
    const counts = await Lab.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const metrics = { total: 0, Available: 0, Occupied: 0, Maintenance: 0 };
    counts.forEach(({ _id, count }) => {
        metrics[_id] = count;
        metrics.total += count;
    });
    return metrics;
};
