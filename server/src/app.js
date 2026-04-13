const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const jobRoutes = require("./routes/job.routes");

const app = express();

app.use(express.json());

// ✅ FINAL CORS FIX
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;