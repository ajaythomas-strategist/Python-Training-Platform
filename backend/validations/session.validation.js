import Joi from 'joi';

const timeRegex = /^\d{2}:\d{2}$/;

export const createSessionSchema = Joi.object({
    classId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({ 'string.pattern.base': 'classId must be a valid MongoDB ObjectId' }),
    date: Joi.date().iso().required().messages({
        'date.base': 'Date must be a valid ISO date',
        'any.required': 'Date is required',
    }),
    startTime: Joi.string()
        .pattern(timeRegex)
        .required()
        .messages({ 'string.pattern.base': 'Start time must be in HH:MM format' }),
    endTime: Joi.string()
        .pattern(timeRegex)
        .required()
        .messages({ 'string.pattern.base': 'End time must be in HH:MM format' }),
    topicsCovered: Joi.string().trim().allow('').optional(),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional(),
}).custom((value, helpers) => {
    // Validate endTime > startTime
    const [startH, startM] = value.startTime.split(':').map(Number);
    const [endH, endM] = value.endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    if (endTotal <= startTotal) {
        return helpers.error('any.invalid', { message: 'endTime must be after startTime' });
    }
    return value;
});

export const updateSessionSchema = Joi.object({
    date: Joi.date().iso().optional(),
    startTime: Joi.string().pattern(timeRegex).optional(),
    endTime: Joi.string().pattern(timeRegex).optional(),
    topicsCovered: Joi.string().trim().allow('').optional(),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional(),
    transferredTo: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .allow(null)
        .optional(),
    transferredCoTrainerTo: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .allow(null)
        .optional(),
});
