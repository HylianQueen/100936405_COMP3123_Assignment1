// COMP 3123 Assignment 1
// Zelda Pelletier
const bcrypt = require("bcryptjs");
const User = require("../models/User");
async function signup(req, res, next)
{
    try
    {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing)
        {
            return res.status(409).json({ status: false, message: "The Username or E-mail already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User has been successfully created", user_id: user._id, username: user.username, email: user.email });
    }
    catch (error)
    {
        next(error);
    }
}
module.exports = { signup };