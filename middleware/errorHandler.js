// COMP 3123 Assignment 1
// Zelda Pelletier
const logger = require("../utils/logger");
function notFound(req, res)
{
    logger.warn("Route not found: " + req.method + " " + req.originalUrl);
    res.status(404).json({status: false, message: "Route not found"});
}
function errorHandler(err, req, res, next)
{
    let status = err.status || 500;
    let message = err.message || "Server error";
    if (err.type === "entity.parse.failed")
    {
        status = 400;
        message = "Malformed JSON";
    }
    else if (err.code === 11000)
    {
        status = 409;
        message = "Username or email already exists";
    }
    else if (err.name === "ValidationError" || err.name === "CastError")
    {
        status = 400;
        message = "Invalid data";
    }
    if (status >= 500)
    {
        message = "Internal server error";
    }
    logger.error(req.method + " " + req.originalUrl + " -> " + status + " " + err.message);
    res.status(status).json({status: false, message});
}
module.exports = {notFound, errorHandler};