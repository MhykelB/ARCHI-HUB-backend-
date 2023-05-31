const express = require("express");
const router = express.Router();
const {
  preSignUp,
  confirmEmail,
  login,
} = require("../controllers/authcontrollers");

//base = /auth
router.post("/preSignUp", preSignUp); //working
router.post("/confirmEmail", confirmEmail); //working
router.post("/login", login); //working
router.get("/completeSignUp/:token", (req, res) => {
  res.send(`the sign up token is ${req.params.token}`);
});

module.exports = router;
