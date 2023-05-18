const jobPostSchema = require("../mongoose_models/jobPostSchema");
const { userSchema } = require("../mongoose_models/userSchema");
const { badRequest, unauthenticatedError } = require("../errorHandler");
const {
  createTopic,
  sendNotificationToMany,
  sendNotificationToOne,
  addSubscribersToTopic,
  sendReactionNotification,
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
    // queryObject.tags = { $regex: , $options: "i" };
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
    // this creates a new topic on the comment and adds the creator as a subsriber to the comment. trigger to this topic when anyone likes or reacts to it.
    await createTopic(`Job ${newPost._id}`, "jobPost");
    await addSubscribersToTopic(`Job ${newPost._id}`, userID);

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
const updateJob = async (req, res) => {
  const jobID = req.params.jobID;
  let queryObject = {};
  const { description, location, pay, tags } = req.body;
  if (!description && !location && !pay && !tags === "") {
    throw new badRequest("missing fields");
  }
  if (description) {
    queryObject.description = description;
  }
  if (location) {
    queryObject.location = location;
  }
  if (pay) {
    queryObject.pay = pay;
  }
  if (tags) {
    queryObject.tags = tags;
  }
  try {
    const updatedJob = await jobPostSchema.findOneAndUpdate(
      { _id: jobID },
      queryObject,
      {
        new: true,
      }
    );
    if (!updatedJob) {
      throw error;
    }
    return res
      .status(201)
      .json({ success: true, message: "job updated successful", queryObject });
  } catch (error) {
    throw error;
  }
};
const reactToJob = async (req, res) => {
  const { userID, username } = req.user;
  const { jobID } = req.params.jobID;
  let job = await jobPostSchema.findById(jobID);
  if (job) {
    try {
      if (job.interactions.includes(userID)) {
        const newArray = job.interactions.filter((IDs) => {
          return IDs !== userID;
        });
        job.set({ interactions: newArray });
        job = await job.save();
        res.status(201).json(job);
      } else {
        const newArray = job.interactions.concat(userID);
        job.set({ interactions: newArray });
        job = await job.save();
        // await sendReactionNotification(triggerkey, `Job ${jobID}`, username);
        // remeberto create this trigger template
        //send notification to the job creator without using his id since you already created and added him to a topic when he created the job, so just trigger to that topic and he'll receive the notification
        res.status(201).json(job);
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteJob = async (req, res) => {
  const jobID = req.params.jobID;

  try {
    const deletedPost = await jobPostSchema.findByIdAndDelete(jobID);
    if (!deletedPost) {
      throw error;
    }
    // sendNotificationToMany("new-job-post", "new-post", {
    //   sender: username,
    // });
    return res.status(201).json({
      success: true,
      message: "post deleted successfully",
      deletedPost,
    });
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getOneUser,
  getAllJobs,
  postJob,
  updateJob,
  deleteJob,
  reactToJob,
};
