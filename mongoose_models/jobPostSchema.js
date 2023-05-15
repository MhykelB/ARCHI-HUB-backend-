const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    created_by_ID: { type: mongoose.Types.ObjectId, ref: "User" },
    created_by_user: { type: String },
    description: { type: String, required: [true, "please describe job"] },
    location: { type: String, required: [true, "describe job location"] },
    pay: { type: String, default: "not specified" },
    interactions: [],
    tags: [], //CONVERT ALL TO LOWERCASE
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobPost", jobPostSchema);
