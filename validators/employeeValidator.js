// COMP 3123 Assignment 1
// Zelda Pelletier
const {body, param, query} = require("express-validator");
function makeRules(isUpdate)
{
    const start = (name) => (isUpdate ? body(name).optional() : body(name).exists().withMessage(name + " is required").bail());
    return [
        start("first_name").isString().withMessage("first_name must be text").bail().trim().isLength({min: 1, max: 50}).withMessage("first_name must be 1 to 50 characters"),
        start("last_name").isString().withMessage("last_name must be text").bail().trim().isLength({min: 1, max: 50}).withMessage("last_name must be 1 to 50 characters"),
        start("email").isString().withMessage("email must be text").bail().trim().isEmail().withMessage("email must be valid").bail().customSanitizer((value) => value.toLowerCase()),
        start("position").isString().withMessage("position must be text").bail().trim().isLength({min: 1, max: 100}).withMessage("position must be 1 to 100 characters"),
        start("salary").isFloat({ gt: 0 }).withMessage("salary must be a positive number").bail().toFloat(),
        start("date_of_joining").isISO8601().withMessage("date_of_joining must be a valid date").bail().toDate(),
        start("department").isString().withMessage("department must be text").bail().trim().isLength({min: 1, max: 100}).withMessage("department must be 1 to 100 characters")
    ];
}
const createRules = makeRules(false);
const updateRules = makeRules(true);
const idParamRule = [param("eid").isMongoId().withMessage("Invalid employee id")];
const idQueryRule = [query("eid").isString().withMessage("Invalid employee id").bail().isMongoId().withMessage("Invalid employee id")];
module.exports = {createRules, updateRules, idParamRule, idQueryRule};