require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./app");

// ✅ IMPORT ROUTES (FIX PATH IF NEEDED)
const authRoutes = require("./auth/auth.routes");
const jobRoutes = require("./routes/job.routes");

const PORT = process.env.PORT || 5000;

// ✅ APPLY CORS FIRST
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

// ✅ DB + SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });