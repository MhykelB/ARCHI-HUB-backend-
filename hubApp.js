//modules
const path = require("path");
//swagger
const swaggerUI = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDoc = YAML.load("./public/swagger.yaml");
const swaggerDoc = require("./swagger.json");
const options = {
  customCssUrl: "https://unpkg.com/swagger-ui-dist@3/swagger-ui.css",
};

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
expressApp.use(
  "/api_docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDoc, options)
);
expressApp.use(errorHandler);
const port = process.env.PORT || 6000;

expressApp.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
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
