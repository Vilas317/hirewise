const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // 🔥 helps filtering by user
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['applied', 'interview', 'rejected'],
      default: 'applied',
      index: true, // 🔥 helps filtering
    },
  },
  { timestamps: true }
);


// 🔥 COMPOUND INDEXES (MOST IMPORTANT)

// Fast filtering: user + status
jobSchema.index({ userId: 1, status: 1 });

// Fast sorting + pagination
jobSchema.index({ userId: 1, createdAt: -1 });

// 🔥 TEXT SEARCH (for search feature)
jobSchema.index({
  title: 'text',
  company: 'text',
});

module.exports = mongoose.model('Job', jobSchema);