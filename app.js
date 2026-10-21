// COMP 3123 Assignment 1
// Zelda Pelletier
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const { apiLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const app = express();
app.use(helmet());
app.use(morgan(":method :url :status :response-time ms", {stream: {write: (message) => logger.info("REQUEST " + message.trim())}}));
app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);
app.get("/health", (req, res) =>
{
    const database = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.status(200).json({status: "ok", message: "API is running", database: database, uptime_seconds: Math.round(process.uptime())});
});
app.use(notFound);
app.use(errorHandler);
module.exports = app;