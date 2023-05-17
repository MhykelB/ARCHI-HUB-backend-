const express = require("express");
const router = express.Router();
const {
  getOneUser,
  getAllJobs,
  postJob,
  updateJob,
  reactToJob,
  deleteJob,
} = require("../controllers/jobsControllers");

//base /jobs
router.get("/getAllJobs", getAllJobs);
router.get("/getUser/:ID", getOneUser);
router.post("/postJob", postJob); //working
router.patch("/updateJob/:jobID", updateJob); //working
router.patch("/reactToJob/:jobID", reactToJob); //working
router.delete("/deleteJob/:jobID", deleteJob); //working

module.exports = router;
