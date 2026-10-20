// COMP 3123 Assignment 1
// Zelda Pelletier
const { validationResult } = require("express-validator");
function validate(req, res, next)
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
        return res.status(400).json({ status: false, message: "Validation has failed", errors: details });
    }
    next();
}
module.exports = validate;