import * as classService from '../services/class.service.js';
import { createClassSchema, updateClassSchema } from '../validations/class.validation.js';

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Admins / SuperAdmin)
export const createClass = async (req, res, next) => {
    try {
        const { error, value } = createClassSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        // The service handles lab double-booking and role validations
        const newClass = await classService.createClass(value);
        res.status(201).json(newClass);
    } catch (err) {
        next(err);
    }
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
export const getClasses = async (req, res, next) => {
    try {
        const classes = await classService.getAllClasses();
        res.status(200).json(classes);
    } catch (err) {
        next(err);
    }
};

// @desc    Update class by ID
// @route   PUT /api/classes/:id
// @access  Private (Admins / SuperAdmin)
export const updateClass = async (req, res, next) => {
    try {
        const { error, value } = updateClassSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const updatedClass = await classService.updateClass(req.params.id, value);
        res.status(200).json(updatedClass);
    } catch (err) {
        // Return a 404 if not found
        if (err.message === 'Class not found') res.status(404);
        next(err);
    }
};
