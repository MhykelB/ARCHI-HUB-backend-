//modules

//swagger
const swaggerUI = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDoc = YAML.load("./swagger.yaml");
const swaggerDoc = require("./swagger.json");

//express
const express = require("express");
const expressApp = express();
require("express-async-errors");
const cors = require("cors");
const errorHandler = require("./errorHandler/errorHandler");
const connectDB = require("./db/connectDB");
//Routers
const authRouter = require("./routes/authRouter");
const resetPasswordRouter = require("./routes/resetPassword");
const jobsRouter = require("./routes/jobsRoutes");
const path = require("path");
const authMiddleware = require("./middleWare/authMiddleWare");
require("dotenv").config();
require("@novu/node").Novu;

//middleware
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

expressApp.use(cors(corsOptions));
expressApp.use(express.static("./public"));
expressApp.use(express.urlencoded({ extended: false })); // allow access to html from sent from req.body
expressApp.use(express.json()); //allows access to req.body

expressApp.use("/auth", authRouter);
expressApp.use("/jobs", authMiddleware, jobsRouter);
expressApp.use("/resetPassword", resetPasswordRouter);
// expressApp.use("/api_docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
expressApp.use(errorHandler);
const port = process.env.PORT || 6000;

expressApp.get("/", (req, res) => {
  res.send("Your back is being watched !!!");
});

const start = async function () {
  await connectDB(process.env.DB_URL).then(() => {
    console.log("connected to DB");
  });
  expressApp.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });
};

start();
