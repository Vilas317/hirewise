const express = require("express");
const cors = require("cors");

console.log("APP FILE RUNNING");

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE (PUT IT HERE ONLY)
app.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ msg: "working" });
});

// ✅ ROUTES
const authRoutes = require("./auth/auth.routes");
app.use("/api/auth", authRoutes);

module.exports = app;