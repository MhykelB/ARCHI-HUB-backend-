const express = require("express");
const router = express.Router();
const {
  getOneUser,
  getAllJobs,
  postJob,
} = require("../controllers/jobsControllers");

//base /jobs
router.get("/getAllJobs", getAllJobs);
router.get("/getUser/:ID", getOneUser);
router.post("/postJob", postJob);

module.exports = router;
