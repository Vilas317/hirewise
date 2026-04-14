const express = require("express");
const app = express();

const authRoutes = require("./auth/auth.routes");
const jobRoutes = require("./routes/job.routes"); // ✅ correct

app.use(express.json()); // 🔥 REQUIRED

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ msg: "working" });
});

module.exports = app;