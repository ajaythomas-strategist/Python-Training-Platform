import asyncHandler from 'express-async-handler';
import { createLabSchema, updateLabSchema } from '../validations/lab.validation.js';
import * as labService from '../services/lab.service.js';

// @desc    Get all labs (optionally filtered by status)
// @route   GET /api/labs
// @access  Protected
export const getLabs = asyncHandler(async (req, res) => {
    const filters = { status: req.query.status };
    const labs = await labService.getLabs(filters);
    res.json(labs);
});

// @desc    Get lab availability metrics
// @route   GET /api/labs/metrics
// @access  Protected
export const getMetrics = asyncHandler(async (req, res) => {
    const metrics = await labService.getAvailabilityMetrics();
    res.json(metrics);
});

// @desc    Get a single lab
// @route   GET /api/labs/:id
// @access  Protected
export const getLabById = asyncHandler(async (req, res) => {
    const lab = await labService.getLabById(req.params.id);
    res.json(lab);
});

// @desc    Create a new lab
// @route   POST /api/labs
// @access  SuperAdmin / Admin
export const createLab = asyncHandler(async (req, res) => {
    const { error, value } = createLabSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const lab = await labService.createLab(value);
    res.status(201).json(lab);
});

// @desc    Update a lab (general fields)
// @route   PUT /api/labs/:id
// @access  SuperAdmin / Admin
export const updateLab = asyncHandler(async (req, res) => {
    const { error, value } = updateLabSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const lab = await labService.updateLab(req.params.id, value);
    res.json(lab);
});

// @desc    Toggle lab maintenance status
// @route   PUT /api/labs/:id/maintenance
// @access  SuperAdmin / Admin
export const setMaintenanceStatus = asyncHandler(async (req, res) => {
    // Body: { maintenance: { startDate, endDate, reason } } or { maintenance: null } to clear
    const maintenanceData = req.body.maintenance ?? null;
    const lab = await labService.setMaintenanceStatus(req.params.id, maintenanceData);
    res.json(lab);
});

// @desc    Delete a lab
// @route   DELETE /api/labs/:id
// @access  SuperAdmin only
export const deleteLab = asyncHandler(async (req, res) => {
    await labService.deleteLab(req.params.id);
    res.status(204).send();
});
