require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Start accepting HTTP traffic immediately. This lets Render reach the health
// endpoint while MongoDB is connecting instead of waiting for the DB first.
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    // A process without its database is not useful for HireWise. Exit so the
    // hosting platform can restart it and report a failed deployment/startup.
    server.close(() => process.exit(1));
    setTimeout(() => process.exit(1), 10000).unref();
  });

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    mongoose.connection.close(false).finally(() => process.exit(0));
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
