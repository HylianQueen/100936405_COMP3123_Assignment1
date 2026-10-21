// COMP 3123 Assignment 1
// Zelda Pelletier
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
async function auth(req, res, next)
{
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
    {
        logger.warn("Auth failed: missing or bad Authorization header on " + req.originalUrl);
        return res.status(401).json({status: false, message: "Missing or invalid Authorization header"});
    }
    const token = header.split(" ")[1];
    let decoded;
    try
    {
        decoded = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});
    }
    catch (error)
    {
        const message = error.name === "TokenExpiredError" ? "Token has expired" : "Invalid token";
        logger.warn("Auth failed: " + message);
        return res.status(401).json({status: false, message});
    }
    try
    {
        const user = await User.findById(decoded.id);
        if (!user)
        {
            logger.warn("Auth failed: user no longer exists");
            return res.status(401).json({status: false, message: "User no longer exists"});
        }
        req.user = {id: user._id};
        next();
    }
    catch (error)
    {
        next(error);
    }
}
module.exports = auth;