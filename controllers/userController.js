// COMP 3123 Assignment 1
// Zelda Pelletier
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
async function signup(req, res, next)
{
    try
    {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing)
        {
            logger.warn("Signup failed, duplicate: " + username);
            return res.status(409).json({ status: false, message: "The Username or E-mail already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        logger.info("Signup success: " + user.username);
        res.status(201).json({ message: "User has been successfully created", user_id: user._id, username: user.username, email: user.email });
    }
    catch (error)
    {
        next(error);
    }
}
async function login(req, res, next)
{
    try
    {
        const {username, email, password} = req.body;
        const query = email ? {email} : {username};
        const user = await User.findOne(query).select("+password");
        if (!user)
        {
            logger.warn("Login failed for: " + (email || username));
            return res.status(401).json({ status: false, message: "You Have Invalid credentials"});
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match)
        {
            logger.warn("Login failed for: " + (email || username));
            return res.status(401).json({status: false, message: "You Have Invalid credentials"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
        logger.info("Login success: " + user.username);
        res.status(200).json({message: "Login successful", token});
    }
    catch (error)
    {
        next(error);
    }
}
module.exports = {signup, login};