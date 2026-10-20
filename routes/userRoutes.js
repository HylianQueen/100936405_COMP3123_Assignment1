// COMP 3123 Assignment 1
// Zelda Pelletier
const express = require("express");
const { signup } = require("../controllers/userController");
const { signupRules } = require("../validators/userValidator");
const validate = require("../middleware/validate");
const router = express.Router();
router.post("/signup", signupRules, validate, signup);
module.exports = router;