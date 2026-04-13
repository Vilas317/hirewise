const Joi = require('joi');

const createJobSchema = Joi.object({
  title: Joi.string().min(3).required(),
  company: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('applied', 'interview', 'rejected').optional()
});

module.exports = {
  createJobSchema
};