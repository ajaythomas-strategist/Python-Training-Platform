import Joi from 'joi';

export const createLabSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        'string.min': 'Lab name must be at least 2 characters',
        'any.required': 'Lab name is required',
    }),
    location: Joi.string().trim().allow('').optional(),
    department: Joi.string().trim().allow('').optional(),
    capacity: Joi.number().integer().min(1).required().messages({
        'number.min': 'Capacity must be a positive integer',
        'any.required': 'Capacity is required',
    }),
    status: Joi.string().valid('Available', 'Occupied', 'Maintenance').optional(),
    assignedAdmin: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .allow(null, '')
        .optional()
        .messages({ 'string.pattern.base': 'assignedAdmin must be a valid MongoDB ObjectId' }),
});

export const updateLabSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    location: Joi.string().trim().allow('').optional(),
    department: Joi.string().trim().allow('').optional(),
    capacity: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid('Available', 'Occupied', 'Maintenance').optional(),
    assignedAdmin: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .allow(null, '')
        .optional(),
    maintenance: Joi.object({
        startDate: Joi.string().allow(null, '').optional(),
        endDate: Joi.string().allow(null, '').optional(),
        reason: Joi.string().allow('').optional(),
    }).optional(),
}).min(1); // Require at least one field to update
