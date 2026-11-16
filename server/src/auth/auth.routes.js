const express = require('express');
const router = express.Router();
const { register, login } = require('./auth.controller');
const validate = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().min(8).max(128).required(),
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().min(1).max(128).required(),
}).unknown(false);

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

module.exports = router;
