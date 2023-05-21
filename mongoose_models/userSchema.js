const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tempUserSchema = new mongoose.Schema(
  {
    password: { type: String, required: [true, "please provide password"] },
    email: { type: String, required: [true, "please provide email"] },
    userToken: { type: String, default: "" },
  },
  { timestamps: true }
);
const userSchema = new mongoose.Schema(
  {
    // _id: { type: mongoose.Types.ObjectId, ref: "tempUser" },
    userName: {
      type: String,
      maxlength: 15,
      default: "",
    },
    password: { type: String, required: [true, "please provide password"] },
    firstName: {
      type: String,
      default: "",
      required: [true, "please provide firstname"],
    },
    lastName: {
      type: String,
      default: "",
      required: [true, "please provide lastname"],
    },
    email: { type: String, required: [true, "please provide email"] },
    fullName: {},
    year: { type: Number },
    workPlace: [],
    matricNo: {
      type: String,
      // required: [true, "please provide valid credentials"],
    },
    interests: [],
    skills: [],
    qualifications: [],
    userToken: { type: String, default: "" },
  },
  { timestamps: true }
);
// didnt use hash password before save cos when the user sets a nwe reset token, save would be called and the hash would be hashed again,  thereby altering the password, so call it specifically

userSchema.methods.createJwt = async function () {
  const token = jwt.sign(
    { userID: this._id, username: this.userName },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
  return token;
};
userSchema.methods.comparePassword = async function (sentPassword) {
  const isMatch = await bcrypt.compare(sentPassword, this.password);
  return isMatch;
};
module.exports = {
  userSchema: mongoose.model("User", userSchema),
  tempUserSchema: mongoose.model("tempUser", tempUserSchema),
};
