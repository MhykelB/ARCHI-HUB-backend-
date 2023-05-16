const { userSchema, tempUserSchema } = require("../mongoose_models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const {
  createNewSubscriber,
  sendNotificationToOne,
  updateSubcriber,
  completeSignUpNotice,
} = require("../novu/novu");

const preSignUp = async (req, res) => {
  async function hashPassword(input) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(input, salt);
    return hash;
  }
  let { email, password } = req.body;
  if (!password || !email) {
    console.log("missing fields");
    throw new badRequest("missing fields");
  }
  try {
    const checkUser = await userSchema.findOne({ email: req.body.email });
    if (checkUser) {
      throw new unauthenticatedError("user with email already exists");
    }
    await tempUserSchema.findOneAndDelete({ email: req.body.email });
    req.body.password = await hashPassword(req.body.password);
    const newUser = await tempUserSchema.create(req.body);
    if (!newUser) {
      throw new unauthenticatedError("Unauthorized, invalid credentials");
    }
    console.log("got here");
    const signUpToken = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: 300 }
    );
    newUser.set({ userToken: signUpToken });
    await newUser.save();
    // await createNewSubscriber(newUser); // logic autoadds subcriber to signup topic
    // await completeSignUpNotice("complete-signup", {
    //   id: newUser._id,
    //   link: `https://archi-hub-backend.vercel.app/auth/completeSignUp/${signUpToken}`,
    // });
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res
      .status(201)
      .json({ success: true, message: "signup link sent", signUpToken });
  } catch (error) {
    throw error;
  }
};
// after clcicking the link, updating the info and submitting
const signUp = async (req, res) => {
  const reqHeaders = req.headers.authorization;
  let { firstName, lastName, userName } = req.body;
  if (!reqHeaders || !firstName || !lastName || !userName) {
    console.log("missing fields");
    throw new badRequest("missing fields");
  }
  if (reqHeaders.startsWith("Bearer")) {
    const token = reqHeaders.split(" ")[1];
    if (token) {
      try {
        const validToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!validToken) {
          throw new unauthenticatedError("Invalid Token, maybe expired");
        }
        const preUser = await tempUserSchema.findOne({ userToken: token });
        if (!preUser) {
          throw new unauthenticatedError("User not found");
        }
        (req.body._id = preUser._id), (req.body.userToken = preUser.userToken);
        req.body.password = preUser.password;
        req.body.email = preUser.email;
        // req.body = {
        //   ...req.body,
        //   id: preUser._id,
        //   email: preUser.email,
        //   password: preUser.password,
        //   userToken: preUser.userToken,
        // };
        userSchema.createIndexes({ username: 1, email: 1 }); // takes care of duplicate issues
        const newUser = await userSchema.create(req.body);
        if (newUser) {
          await tempUserSchema.deleteOne({ _id: preUser._id });
        }

        // await sendNotificationToOne("user-signed-up", {
        //   id: newUser._id,
        //   userName: newUser.userName,
        // });
        // await updateSubcriber({
        //   id: newUser._id,
        //   firstName: newUser.firstName,
        //   lastName: newUser.lastName,
        //   interest: newUser.interests,
        // });
        return res
          .status(201)
          .json({ success: true, message: "new account created", newUser });
      } catch (error) {
        throw error;
      }
    }
  } else {
    throw error;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  if (!email || !password) {
    throw new badRequest("Unauthorized, fields can't be empty");
  }
  try {
    const isUser = await userSchema.findOne({ email: email });
    if (!isUser) {
      throw new unauthenticatedError("Unauthorized, invalid credentials");
    }
    const checkPassword = await isUser.comparePassword(password);
    if (!checkPassword) {
      throw new unauthenticatedError("Unauthorized, invalid credentials");
    }
    const token = await isUser.createJwt();
    return res
      .status(201)
      .json({ success: true, message: "login successful", token });
  } catch (error) {
    throw error;
  }
};

module.exports = { preSignUp, signUp, login };
