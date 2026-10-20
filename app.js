// COMP 3123 Assignment 1
// Zelda Pelletier
const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(helmet());
app.use(express.json());
app.get("/health", (req, res) =>
{
    res.status(200).json({ status: "ok", message: "API is running" });
});
module.exports = app;