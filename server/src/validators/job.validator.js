const Joi = require('joi');

const createJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).required(),
  company: Joi.string().trim().min(1).max(120).required(),
  source: Joi.string().trim().max(100).allow('').optional(),
  description: Joi.string().max(20000).allow('').optional(),
  status: Joi.string().valid('applied', 'interview', 'rejected').default('applied'),
}).unknown(false);

const updateJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).required(),
  company: Joi.string().trim().min(1).max(120).required(),
  source: Joi.string().trim().max(100).allow('').optional(),
  description: Joi.string().max(20000).allow('').optional(),
  status: Joi.string().valid('applied', 'interview', 'rejected').required(),
}).unknown(false);

const jobsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(5),
  search: Joi.string().trim().max(100).allow('').default(''),
  status: Joi.string().valid('applied', 'interview', 'rejected').allow(''),
  sort: Joi.string().valid('newest', 'oldest', 'company_asc', 'company_desc', 'title_asc', 'title_desc').default('newest'),
}).unknown(false);

module.exports = { createJobSchema, updateJobSchema, jobsQuerySchema };
