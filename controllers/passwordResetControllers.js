const mongoose = require("mongoose");
const userSchema = require("../mongoose_models/userSchema");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const { sendResetToken } = require("../novu/novu");
const { Novu } = require("@novu/node");
const jwt = require("jsonwebtoken");

const createNewPasswordToken = async (req, res) => {
  // const { email } = req.body;
  // console.log(email);
  // const user = await userSchema.findOne({ email: email });
  // console.log(user);
  // if (!user) {
  //   throw new unauthenticatedError("Invalid Credentials");
  // }
  // try {
  //   const token = jwt.sign({ email: user.password }, process.env.JWT_SECRET, {
  //     expiresIn: "20s",
  //   });
  //   user.set({ resetToken: token });
  //   await user.save();
  //   await sendResetToken("reset-password", {
  //     id: user._id,
  //     name: user.userName,
  //     link: `https://archi-hub-backend.vercel.app/resetPassword/${token}`,
  //   });
  //   //LINK WILL LEAD TO A FRONT PAGE
  //   res
  //     .status(201)
  //     .json({ success: true, message: `reset-link sent with ${token}` });
  // } catch (error) {
  //   throw error;
  // }
  res.send("testingg");
};

const setNewPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  const validToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!validToken) {
    throw new unauthenticatedError("Invalid Token");
  }
  try {
    const user = await userSchema.findOne({ resetToken: token });
    user.set({ password: newPassword });
    user.save();
    res.status(200).json({ message: `password reset successfull` });
  } catch (error) {
    throw error;
  }
};
module.exports = { createNewPasswordToken, setNewPassword };
