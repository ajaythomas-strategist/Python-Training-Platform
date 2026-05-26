import Joi from 'joi';

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

export const markAttendanceSchema = Joi.object({
    classId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid Class ID format',
        'any.required': 'Class ID is required',
    }),
    sessionId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid Session ID format',
        'any.required': 'Session ID is required',
    }),
    studentId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid Student ID format',
        'any.required': 'Student ID is required',
    }),
    status: Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required(),
    remarks: Joi.string().trim().allow('', null).optional(),
});
