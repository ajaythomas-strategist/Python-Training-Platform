import Joi from 'joi';

// Validation schema for creating a new user / registration
export const registerSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().required(),
  phone: Joi.string().allow('', null).trim(),
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Trainer', 'Co-Trainer', 'Student').required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').default('Other'),
  
  // Conditionally require fields based on role!
  // If role is Student, 'batch' is allowed. Otherwise, it's forbidden.
  batch: Joi.string().trim().when('role', { 
    is: 'Student', 
    then: Joi.optional(), 
    otherwise: Joi.forbidden() 
  }),
  
  // If role is Trainer or Co-Trainer, 'department' is allowed. Otherwise, forbidden.
  department: Joi.string().trim().when('role', { 
    is: Joi.valid('Trainer', 'Co-Trainer'), 
    then: Joi.optional(), 
    otherwise: Joi.forbidden() 
  }),
  
  highSchool: Joi.string().allow('', null).trim()
});

// Validation schema for login
export const loginSchema = Joi.object({
  email: Joi.string().required().trim(),
  password: Joi.string().required()
});
