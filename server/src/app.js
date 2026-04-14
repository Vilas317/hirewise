const cors = require("cors");
const express = require("express");
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

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/test", (req, res) => {
  res.json({ msg: "working" });
});

module.exports = app;