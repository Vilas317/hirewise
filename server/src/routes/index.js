const express = require("express");

const router = express.Router();

// import routes
const authRoutes = require("../auth/auth.routes");
const jobRoutes = require("./job.routes");

// use routes
router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);

module.exports = router;