const mongoose = require("mongoose");
const userSchema = require("../mongoose_models/userSchema");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const {
  createNewSubscriber,
  createTopic,
  sendNotificationToMany,
  sendNotificationToOne,
} = require("../novu/novu");
const { Novu } = require("@novu/node");

const signUp = async (req, res) => {
  const { firstName, lastName, userName, password, email } = req.body;
  if (!firstName || !lastName || !userName || !password || !email) {
    console.log("missing fields");
    throw new badRequest("missing fields");
  }
  try {
    await userSchema.createIndexes({ username: 1 }); // takes care of duplicate username issue
    const newUser = await userSchema.create(req.body);
    if (!newUser) {
      throw new unauthenticatedError("Unauthorized, invalid credentials");
    }
    console.log("got here");
    await createNewSubscriber(newUser); // logic autoadds subcriber to signup topic
    await sendNotificationToOne("user-signed-up", {
      id: newUser._id,
      userName: newUser.userName,
    });

    return res
      .status(201)
      .json({ success: true, message: "new account created" });
  } catch {
    throw error;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw error;
  }
  try {
    const isUser = await userSchema.findOne({ email: email });
    if (!isUser) {
      throw error;
    }
    const checkPassword = await isUser.comparePassword(password);
    if (!checkPassword) {
      throw error;
    }
    const token = await isUser.createJwt();
    return res
      .status(201)
      .json({ success: true, message: "login successful", token });
  } catch (error) {
    throw error;
  }
};

const createNewPasswordToken = async (req, res) => {
  const { email } = req.body;
  const user = await userSchema.findOne({ email: email });
  if (!user) {
    throw new unauthenticatedError("Invalid Credentials");
  }
  try {
    const token = await jwt.sign(
      { email: user.password },
      process.env.JWT_SECRET,
      {
        expiresIn: "20s",
      }
    );
    user.set({ token: token });
    await user.save();
    await sendNotificationToOne("change-password", {
      id: user_id,
      url: `http://localhost:5000/reset-password/${token}`,
    });
    res
      .status(201)
      .json({ success: true, message: `reset-link sent with ${token}` });
  } catch (error) {
    throw error;
  }
};

module.exports = { signUp, login };
