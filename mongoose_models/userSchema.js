const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      maxlength: 15,
      required: [true, "please provide username"],
    },
    password: { type: String, required: [true, "please provide password"] },
    firstName: { type: String, required: [true, "please provide firstname"] },
    lastName: { type: String, required: [true, "please provide lastname"] },
    email: { type: String, required: [true, "please provide email"] },
    fullName: {},
    year: { type: Number },
    workPlace: [],
    matricNo: {
      type: String,
      // required: [true, "please provide valid credentials"],
    },
    interest: [],
    skills: [],
    qualifications: [],
    resetToken: { type: String, default: "" },
  },
  { timestamps: true }
);
// didnt use hash password before save cos when the user sets a nwe reset token, save would be called and the hash would be hashed again,  thereby altering the password, so call it specifically

userSchema.methods.createJwt = async function () {
  const token = jwt.sign(
    { userID: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
};
userSchema.methods.comparePassword = async function (sentPassword) {
  const isMatch = await bcrypt.compare(sentPassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
