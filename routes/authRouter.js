const express = require("express");
const router = express.Router();
const { signUp, login } = require("../controllers/authcontrollers");

router.post("/register", signUp);
router.post("/login", login);

module.exports = router;
