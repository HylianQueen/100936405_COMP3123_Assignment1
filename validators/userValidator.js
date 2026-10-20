// COMP 3123 Assignment 1
// Zelda Pelletier
const {body} = require("express-validator");
const signupRules = [
    body("username").isString().withMessage("Username must be text").bail().trim().isLength({ min: 3, max: 30 }).withMessage("Username required to be 3 to 30 characters"),
    body("email").isString().withMessage("Email must be text").bail().trim().isEmail().withMessage("Email must be valid").bail().customSanitizer((value) => value.toLowerCase()),
    body("password").isString().withMessage("Password must be text").bail().matches(/^(?=.*[A-Za-z])(?=.*\d).{8,64}$/).withMessage("Password required to be 8 to 64 characters with a letter and a number in it")
];
const loginRules = [
    body("username").optional().isString().withMessage("Username must be text"),
    body("email").optional().isString().withMessage("Email must be text").bail().isEmail().withMessage("Email must be valid").bail().customSanitizer((value) => value.toLowerCase()),
    body("password").isString().withMessage("Password must be text").bail().notEmpty().withMessage("Password is required"),
    body().custom((value, { req }) =>
    {
        if (!req.body?.username && !req.body?.email)
        {
            throw new Error("Username or email is required");
        }
        return true;
    })
];
module.exports = {signupRules, loginRules};