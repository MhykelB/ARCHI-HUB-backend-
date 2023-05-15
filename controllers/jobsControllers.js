const jobPostSchema = require("../mongoose_models/jobPostSchema");
const { userSchema } = require("../mongoose_models/userSchema");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const {
  sendNotificationToMany,
  sendNotificationToOne,
} = require("../novu/novu");

const getOneUser = async (req, res) => {
  const { ID } = req.params.ID;
  try {
    const user = await userSchema.findOne({ _id: ID });
    res.status(201).json(user);
  } catch (error) {
    throw error;
  }
};

const getAllJobs = async (req, res) => {
  const { search } = req.query;
  const queryObject = {};
  if (search) {
    queryObject.tags = { $regex: `/${search}$/`, $options: "i" };
    // queryObject.tags = search;
    console.log(queryObject);
    // {tags : {$in:search}}
  }
  try {
    const jobs = await jobPostSchema.find(queryObject);
    if (jobs) {
      res.status(201).json({ jobList: jobs });
    }
  } catch (error) {
    throw error;
  }
};

const postJob = async (req, res) => {
  const { userID, username } = req.user;
  req.body.created_by_ID = userID;
  req.body.created_by_user = username;
  try {
    const newPost = await jobPostSchema.create(req.body);
    if (!newPost) {
      throw error;
    }
    // sendNotificationToMany("new-job-post", "new-post", {
    //   sender: username,
    // });
    return res
      .status(201)
      .json({ success: true, message: "post successful", newPost });
  } catch (error) {
    throw error;
  }
};
// const updateJob = async (req, res) => {
//   const { userID, username } = req.user;
//   req.body.created_by_ID = userID;
//   req.body.created_by_user = username;
//   try {
//     const newPost = await jobPostSchema.create(req.body);
//     if (!newPost) {
//       throw error;
//     }
//     return res.status(201).json({ success: true, message: "post successful" });
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = { getOneUser, getAllJobs, postJob };
