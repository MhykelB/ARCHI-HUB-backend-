const express = require("express");
const router = express.Router();
const {
  createNewPasswordToken,
  setNewPassword,
} = require("../controllers/passwordResetControllers");
// base  = /resetPassword
router.post("/createToken", createNewPasswordToken);
router.post("/setNewPassword", setNewPassword);

module.exports = router;
