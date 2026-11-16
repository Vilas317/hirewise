const Job = require('./job.model');
const mongoose = require('mongoose');

const SORT_OPTIONS = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  company_asc: { company: 1, _id: 1 },
  company_desc: { company: -1, _id: -1 },
  title_asc: { title: 1, _id: 1 },
  title_desc: { title: -1, _id: -1 },
};

const SORT_COLLATION = {
  locale: 'en',
  strength: 2,
};

const createJob = async (data, userId) => {
  return Job.create({
    userId,
    title: data.title,
    company: data.company,
    source: data.source,
    description: data.description,
    status: data.status || 'applied',
  });
};

const getJobs = async (userId, query) => {
  const filter = { userId };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escaped, 'i');

    filter.$or = [
      { title: searchRegex },
      { company: searchRegex },
    ];
  }

  // Validate pagination defensively, even though Joi validates it earlier.
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(query.limit, 10) || 5)
  );

  const skip = (page - 1) * limit;

  const sort = SORT_OPTIONS[query.sort] || SORT_OPTIONS.newest;

  const jobsQuery = Job.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Apply case-insensitive collation only to alphabetical sorting.
  if (['company_asc', 'company_desc', 'title_asc', 'title_desc'].includes(query.sort)) {
    jobsQuery.collation(SORT_COLLATION);
  }

  const [jobs, total] = await Promise.all([
    jobsQuery.exec(),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

const updateJob = async (jobId, userId, data) => {
  if (!mongoose.isValidObjectId(jobId)) {
    const error = new Error('Invalid application ID.');
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, userId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!job) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  return job;
};

const deleteJob = async (jobId, userId) => {
  if (!mongoose.isValidObjectId(jobId)) {
    const error = new Error('Invalid application ID.');
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findOneAndDelete({
    _id: jobId,
    userId,
  });

  if (!job) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  return job;
};

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

  stats.forEach(({ _id, count }) => {
    result[_id] = count;
    result.total += count;
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