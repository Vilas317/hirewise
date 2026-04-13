const express = require("express");
const cors = require("cors");

const app = express();

const routes = require("./routes");
const limiter = require("./middleware/ratelimit.middleware");
const errorHandler = require("./middleware/error.middleware");

// ✅ CORS FIRST
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// 🔐 Rate limiter
app.use(limiter);

// 📦 Routes
app.use("/api", routes);

// ❌ Error handler last
app.use(errorHandler);

app.use(express.json());

module.exports = app;