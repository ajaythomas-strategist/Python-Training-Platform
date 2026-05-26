// backend/controllers/auth.controller.js
import asyncHandler from 'express-async-handler';
import * as authService from '../services/auth.service.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  res.json(profile);
});
