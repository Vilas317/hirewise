const jobService = require('./job.service');
const asyncHandler = require('../../utils/asyncHandler');
const logger = require('../../utils/logger');

// CREATE
const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user.id);

  logger.info(`User ${req.user.id} created job | title: ${req.body.title}`);

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

// GET
const getJobs = asyncHandler(async (req, res) => {
  const data = await jobService.getJobs(req.user.id, req.query);

  logger.info(`User ${req.user.id} fetched jobs | query: ${JSON.stringify(req.query)}`);

  res.status(200).json({
    success: true,
    count: data.total,
    pagination: {
      page: data.page,
      pages: data.pages,
    },
    data: {
      jobs: data.jobs,
    },
  });
});

// UPDATE
const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(
    req.params.id,
    req.user.id,
    req.body
  );

  logger.info(`User ${req.user.id} updated job | jobId: ${req.params.id}`);

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
});

// DELETE
const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user.id);

  logger.info(`User ${req.user.id} deleted job | jobId: ${req.params.id}`);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

// STATS
const getJobStats = asyncHandler(async (req, res) => {
  const stats = await jobService.getJobStats(req.user.id);

  logger.info(`User ${req.user.id} fetched job stats`);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobStats,
};