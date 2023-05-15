const express = require("express");
const router = express.Router();
const { preSignUp, signUp, login } = require("../controllers/authcontrollers");

//base = /auth
router.post("/preSignUp", preSignUp);
router.post("/register", signUp);
router.post("/login", login);
router.get(`/completeSignUp/:token`, (req, res) => {
  res.send(`the sign up token is ${req.params.token}`);
});

module.exports = router;
