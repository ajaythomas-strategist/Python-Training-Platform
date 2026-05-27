import Joi from 'joi';

// Regular expression to validate MongoDB ObjectId
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Joi schema for validating class creation payload
// Note: Verification of the assignedTrainer's actual role (checking if they are actually a "Trainer" or "Co-Trainer" in the DB)
// will be handled in the service/controller layer since it requires a database query.
export const createClassSchema = Joi.object({
    className: Joi.string().required().trim(),
    assignedTrainer: Joi.string()
        .regex(objectIdPattern)
        .message('Invalid Trainer ID format')
        .optional(),
    coTrainers: Joi.array()
        .items(Joi.string().regex(objectIdPattern).message('Invalid Co-Trainer ID format'))
        .optional(),
    assignedLab: Joi.string().regex(objectIdPattern).message('Invalid Lab ID format').optional(),
    status: Joi.string().valid('Active', 'Completed').default('Active'),
    startDate: Joi.date().iso().optional(),
});

export const updateClassSchema = Joi.object({
    className: Joi.string().trim().optional(),
    assignedTrainer: Joi.string()
        .regex(objectIdPattern)
        .message('Invalid Trainer ID format')
        .optional(),
    coTrainers: Joi.array()
        .items(Joi.string().regex(objectIdPattern).message('Invalid Co-Trainer ID format'))
        .optional(),
    assignedLab: Joi.string().regex(objectIdPattern).message('Invalid Lab ID format').optional(),
    status: Joi.string().valid('Active', 'Completed').optional(),
    startDate: Joi.date().iso().optional(),
    completedTasks: Joi.array()
        .items(Joi.string().regex(objectIdPattern).message('Invalid Guideline ID format'))
        .optional(),
});
