const Job = require('./job.model');
const mongoose = require('mongoose');

// CREATE
const createJob = async (data, userId) => {
  const { title, company, status } = data;

  if (!title || !company || !status) {
    throw new Error("All fields are required");
  }

  return await Job.create({
    title,
    company,
    status,
    userId,
  });
};

// GET (FILTER + SEARCH + PAGINATION)
const getJobs = async (userId, query) => {
  const filter = { userId };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Job.countDocuments(filter);

  return {
    jobs,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// UPDATE
const updateJob = async (jobId, userId, data) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    data,
    { new: true }
  );

  if (!job) {
    throw new Error('Job not found or unauthorized');
  }

  return job;
};

// DELETE
const deleteJob = async (jobId, userId) => {
  const job = await Job.findOneAndDelete({
    _id: jobId,
    userId,
  });

  if (!job) {
    throw new Error('Job not found or unauthorized');
  }

  return job;
};

// STATS
const getJobStats = async (userId) => {
  const stats = await Job.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
  };

  stats.forEach((item) => {
    result[item._id] = item.count;
    result.total += item.count;
  });

  return result;
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobStats,
};