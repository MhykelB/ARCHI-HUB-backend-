const mongoose = require("mongoose");
const userSchema = require("../mongoose_models/userSchema");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const { sendNotificationToOne } = require("../novu/novu");
const { Novu } = require("@novu/node");
const jwt = require("jsonwebtoken");

const createNewPasswordToken = async (req, res) => {
  const { email } = req.body;
  const user = await userSchema.findOne({ email: email });
  if (!user) {
    throw new unauthenticatedError("Invalid Credentials");
  }
  try {
    const token = jwt.sign({ email: user.password }, process.env.JWT_SECRET, {
      expiresIn: "20s",
    });
    user.set({ resetToken: token });
    await user.save();
    await sendNotificationToOne("change-password", {
      id: user_id,
      url: `http://localhost:5000/resetPassword/${token}`,
    });
    //LINK WILL LEAD TO A FRONT PAGE
    res
      .status(201)
      .json({ success: true, message: `reset-link sent with ${token}` });
  } catch (error) {
    throw error;
  }
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
    res.status(200).json({ messgae: `password reset successfull` });
  } catch (error) {
    throw error;
  }
};
module.exports = { createNewPasswordToken };
