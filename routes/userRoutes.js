// COMP 3123 Assignment 1
// Zelda Pelletier
const express = require("express");
const {signup, login} = require("../controllers/userController");
const {signupRules, loginRules} = require("../validators/userValidator");
const validate = require("../middleware/validate");
const {authLimiter} = require("../middleware/rateLimiter");
const router = express.Router();
router.post("/signup", authLimiter, signupRules, validate, signup);
router.post("/login", authLimiter, loginRules, validate, login);
module.exports = router;