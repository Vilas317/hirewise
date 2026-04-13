const express = require('express');
const router = express.Router();

const jobController = require('./job.controller');
const protect = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createJobSchema } = require('../../validators/job.validator');

// CREATE
router.post('/', protect, validate(createJobSchema), jobController.createJob);

// STATS (IMPORTANT: before "/")
router.get('/stats', protect, jobController.getJobStats);

// GET ALL
router.get('/', protect, jobController.getJobs);

// UPDATE
router.put('/:id', protect, validate(createJobSchema), jobController.updateJob);

// DELETE
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;