import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import * as guidelineService from '../services/guideline.service.js';

const createSchema = Joi.object({
    role: Joi.string().valid('Admin', 'Trainer', 'Co-Trainer', 'Student', 'All').required(),
    text: Joi.string().trim().min(3).max(500).required(),
});

// @desc    Get guidelines (filtered by role if not SuperAdmin/Admin)
// @route   GET /api/guidelines
// @access  Protected
export const getGuidelines = asyncHandler(async (req, res) => {
    const { role } = req.user;

    // SuperAdmin/Admin see all guidelines grouped
    if (role === 'SuperAdmin' || role === 'Admin') {
        const grouped = await guidelineService.getGuidelinesGrouped();
        return res.json({ grouped: true, data: grouped });
    }

    // Other roles see their own + 'All' guidelines
    const guidelines = await guidelineService.getGuidelines(role);
    res.json({ grouped: false, data: guidelines });
});

// @desc    Create a new guideline
// @route   POST /api/guidelines
// @access  SuperAdmin / Admin
export const createGuideline = asyncHandler(async (req, res) => {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const guideline = await guidelineService.createGuideline({
        ...value,
        createdBy: req.user._id,
    });
    res.status(201).json(guideline);
});

// @desc    Delete (soft) a guideline
// @route   DELETE /api/guidelines/:id
// @access  SuperAdmin / Admin
export const deleteGuideline = asyncHandler(async (req, res) => {
    await guidelineService.hardDeleteGuideline(req.params.id);
    res.status(204).send();
});
