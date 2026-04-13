const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const jobRoutes = require("./routes/job.routes");

const app = express();

// ✅ BODY PARSER
app.use(express.json());

// ✅ CORS (FIXED HERE)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hirewise-47ji.onrender.com"
  ],
  credentials: true,
}));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// ✅ TEST ROUTE (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;