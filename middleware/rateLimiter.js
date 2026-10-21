// COMP 3123 Assignment 1
// Zelda Pelletier
const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");
function makeLimiter(limit)
{
    return rateLimit(
    {
        windowMs: 15 * 60 * 1000,
        limit: limit,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) =>
        {
            logger.warn("Rate limit hit: " + req.ip + " " + req.method + " " + req.originalUrl);
            res.status(429).json({status: false, message: "Too many requests, try again later"});
        }
    });
}
module.exports = {authLimiter: makeLimiter(20), apiLimiter: makeLimiter(300)};