const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MUST BE HERE
app.post("/test", (req, res) => {
  res.json({ msg: "working" });
});

// routes
const authRoutes = require("./auth/auth.routes");
app.use("/api/auth", authRoutes);

module.exports = app;