// COMP 3123 Assignment 1
// Zelda Pelletier
const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {createRules, updateRules, idParamRule, idQueryRule} = require("../validators/employeeValidator");
const {getEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee} = require("../controllers/employeeController");
const router = express.Router();
router.use(auth);
router.get("/employees", getEmployees);
router.post("/employees", createRules, validate, createEmployee);
router.get("/employees/:eid", idParamRule, validate, getEmployee);
router.put("/employees/:eid", idParamRule, updateRules, validate, updateEmployee);
router.delete("/employees", idQueryRule, validate, deleteEmployee);
module.exports = router;