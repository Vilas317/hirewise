const cors = require("cors");
const express = require("express");
const app = express();

const authRoutes = require("./auth/auth.routes");
const jobRoutes = require("./modules/job/job.routes");

app.use(
  cors({
    origin: true, // ✅ allow all origins (safe for dev/demo)
    credentials: true,
  })
);
app.use(express.json()); // 🔥 REQUIRED

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ msg: "working" });
});

module.exports = app;