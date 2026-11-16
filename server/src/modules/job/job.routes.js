const express = require('express');
const router = express.Router();
const jobController = require('./job.controller');
const protect = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createJobSchema, updateJobSchema, jobsQuerySchema } = require('../../validators/job.validator');

router.use(protect);
router.get('/stats', jobController.getJobStats);
router.get('/', validate(jobsQuerySchema, 'query'), jobController.getJobs);
router.post('/', validate(createJobSchema), jobController.createJob);
router.put('/:id', validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
