const express = require('express');
const router = express.Router();

console.log("🔥 JOB ROUTES LOADED");

const jobController = require('./job.controller'); // ✅ SAME FOLDER
const protect = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createJobSchema } = require('../../validators/job.validator');

// CREATE
router.post('/', protect, validate(createJobSchema), jobController.createJob);

// STATS
router.get('/stats', protect, jobController.getJobStats);

// GET ALL
router.get('/', protect, jobController.getJobs);

// UPDATE
router.put('/:id', protect, validate(createJobSchema), jobController.updateJob);

// DELETE
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;
// const express = require("express");
// const router = express.Router();

// const jobController = require("../controllers/job.controller"); // ✅ correct
// const protect = require("../middleware/auth.middleware");

// // OPTIONAL (only if file exists)
// let validate, createJobSchema;
// try {
//   validate = require("../middleware/validate.middleware");
//   ({ createJobSchema } = require("../validators/job.validator"));
// } catch (e) {
//   console.log("Validation disabled temporarily");
// }

// // CREATE
// router.post(
//   "/",
//   protect,
//   validate && createJobSchema ? validate(createJobSchema) : (req, res, next) => next(),
//   jobController.createJob
// );

// // STATS (must come before /:id)
// router.get("/stats", protect, jobController.getJobStats);

// // GET ALL
// router.get("/", protect, jobController.getJobs);

// // UPDATE
// router.put("/:id", protect, jobController.updateJob);

// // DELETE
// router.delete("/:id", protect, jobController.deleteJob);

// module.exports = router;