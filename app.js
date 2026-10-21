// COMP 3123 Assignment 1
// Zelda Pelletier
const express = require("express");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const app = express();
app.use(helmet());
app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);
app.get("/health", (req, res) =>
{
    res.status(200).json({status: "ok", message: "API is running"});
});
module.exports = app;