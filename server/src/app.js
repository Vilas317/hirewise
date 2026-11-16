console.log("CORS UPDATED");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const authRoutes = require("./auth/auth.routes");
const jobRoutes = require("./modules/job/job.routes");

// 🔥 TEMP FIX (ALLOW ALL ORIGINS)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Lightweight readiness endpoint used by the frontend to wake the service
// and determine whether MongoDB is connected.
app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "starting",
    database: databaseReady ? "connected" : "connecting",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/test", (req, res) => {
  res.json({ msg: "working" });
});

module.exports = app;