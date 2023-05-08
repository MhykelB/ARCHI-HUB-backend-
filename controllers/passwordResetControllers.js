const mongoose = require("mongoose");
const userSchema = require("../mongoose_models/userSchema");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const { sendResetToken } = require("../novu/novu");
const { Novu } = require("@novu/node");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createNewPasswordToken = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await userSchema.findOne({ email: email });
  console.log(user);
  if (!user) {
    throw new unauthenticatedError("Invalid Credentials");
  }
  try {
    const token = jwt.sign({ email: user.firstName }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.set({ resetToken: token });
    await user.save();
    await sendResetToken("reset-password", {
      id: user._id,
      name: user.userName,
      link: `https://archi-hub-backend.vercel.app/resetPassword/${token}`,
    });
    //LINK WILL LEAD TO A FRONT PAGE
    res.status(201).json({
      success: true,
      message: `reset-link sent with token`,
      resetToken: token,
    });
  } catch (error) {
    throw error;
  }
};

const setNewPassword = async (req, res) => {
  async function hashPassword(input) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(input, salt);
    return hash;
  }
  let { newPassword } = req.body;
  const reqHeaders = req.headers.authorization;
  console.log(reqHeaders);
  if (!reqHeaders || !newPassword) {
    throw new unauthenticatedError("Invalid token");
  }
  if (reqHeaders.startsWith("Bearer")) {
    const token = reqHeaders.split(" ")[1];
    if (token) {
      try {
        const validToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!validToken) {
          throw new unauthenticatedError("Invalid Token, maybe expired");
        }

        const user = await userSchema.findOne({ resetToken: token });
        user.set({ password: await hashPassword(newPassword) });
        await user.save();
        res
          .status(200)
          .json({ message: `password reset successfull ${user.password}` });
      } catch (error) {
        throw error;
      }
    }
  }
};
module.exports = { createNewPasswordToken, setNewPassword };
