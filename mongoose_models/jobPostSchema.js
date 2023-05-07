const mongoose = require("mongoose");
const bcrpyt = require("bcrpyt");
const jwt = require("jsonwebtoken");

const jobPostSchema = new mongoose.Schema(
  {
    created_by_ID: { type: mongoose.Types.ObjectId, ref: "" },
    created_by_user: { type: String },
    reactions: { type: Number },
    text: {},
    tags: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobPost", jobPostSchema);
