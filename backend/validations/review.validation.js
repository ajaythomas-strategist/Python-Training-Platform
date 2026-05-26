import Joi from 'joi';

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

export const createReviewSchema = Joi.object({
    trainerId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid Trainer ID format',
        'any.required': 'Trainer ID is required',
    }),
    classId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid Class ID format',
        'any.required': 'Class ID is required',
    }),
    rating: Joi.number().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1.0',
        'number.max': 'Rating cannot exceed 5.0',
        'any.required': 'Rating is required',
    }),
    comments: Joi.string().trim().max(1000).allow('', null).optional().messages({
        'string.max': 'Comments cannot exceed 1000 characters',
    }),
});
