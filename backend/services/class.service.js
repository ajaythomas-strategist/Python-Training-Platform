import Class from '../models/Class.js';
import User from '../models/User.js';

export const createClass = async (classData) => {
    const { className, assignedTrainer, coTrainers, assignedLab, status } = classData;

    // 1. Verify Trainer role
    if (assignedTrainer) {
        const trainer = await User.findById(assignedTrainer);
        if (!trainer) throw new Error('Assigned trainer not found');
        if (trainer.role !== 'Trainer') throw new Error('Assigned user is not a Trainer');
    }

    // 1b. Verify Co-Trainer roles
    if (coTrainers && coTrainers.length > 0) {
        const coTrainerUsers = await User.find({ _id: { $in: coTrainers } });
        if (coTrainerUsers.length !== coTrainers.length) {
            throw new Error('One or more co-trainers not found');
        }
        const invalidCoTrainers = coTrainerUsers.filter(
            (u) => u.role !== 'Co-Trainer' && u.role !== 'Trainer',
        );
        if (invalidCoTrainers.length > 0) {
            throw new Error('One or more assigned co-trainers do not have the correct role');
        }
    }

    // 2. Prevent lab double booking if the class is Active
    const classStatus = status || 'Active';
    if (assignedLab && classStatus === 'Active') {
        const activeClassInLab = await Class.findOne({ assignedLab, status: 'Active' });
        if (activeClassInLab) {
            throw new Error('Lab is already assigned to another active class');
        }
    }

    // 3. Create class
    const newClass = new Class(classData);
    await newClass.save();
    return newClass;
};

export const getAllClasses = async () => {
    return await Class.find()
        .populate('assignedTrainer', 'name email role')
        .populate('coTrainers', 'name email role')
        .populate('assignedLab', 'name')
        .populate('completedTasks', '_id');
};

export const getClassById = async (id) => {
    const foundClass = await Class.findById(id)
        .populate('assignedTrainer', 'name email role')
        .populate('coTrainers', 'name email role')
        .populate('assignedLab', 'name')
        .populate('completedTasks', '_id');

    if (!foundClass) throw new Error('Class not found');
    return foundClass;
};

export const updateClass = async (id, updateData) => {
    const classToUpdate = await Class.findById(id);
    if (!classToUpdate) throw new Error('Class not found');

    // Prevent lab double booking on update
    if (updateData.assignedLab || updateData.status) {
        const labToCheck = updateData.assignedLab || classToUpdate.assignedLab;
        const statusToCheck = updateData.status || classToUpdate.status;

        if (labToCheck && statusToCheck === 'Active') {
            const activeClassInLab = await Class.findOne({
                assignedLab: labToCheck,
                status: 'Active',
                _id: { $ne: id },
            });
            if (activeClassInLab) {
                throw new Error('Lab is already assigned to another active class');
            }
        }
    }

    if (updateData.assignedTrainer) {
        const trainer = await User.findById(updateData.assignedTrainer);
        if (!trainer) throw new Error('Assigned trainer not found');
        if (trainer.role !== 'Trainer') throw new Error('Assigned user is not a Trainer');
    }

    const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
        .populate('assignedTrainer', 'name email role')
        .populate('coTrainers', 'name email role')
        .populate('assignedLab', 'name');

    return updatedClass;
};
