//modules
const express = require("express");
const expressApp = express();
require("express-async-errors");
const errorHandler = require("./errorHandler/errorHandler");
const connectDB = require("./db/connectDB");
const authRouter = require("./routes/authRouter");
const resetPasswordRouter = require("./routes/resetPassword");
const path = require("path");
require("dotenv").config();
require("@novu/node").Novu;
// import { Novu } from "@novu/node";

//middleware
expressApp.use(express.static("./public"));
expressApp.use(express.json()); //allows access to req.body
expressApp.use("/auth", authRouter);
expressApp.use("/resetPassword", resetPasswordRouter);
expressApp.use(errorHandler);
const port = process.env.PORT || 6000;

expressApp.get("/", (req, res) => {
  res.send("Your back is being watched !!!");
});
expressApp.get("/docs", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
  // res.send("good t");
});
expressApp.get(`/resetPassword/:token`, (req, res) => {
  res.send(`the token is ${req.params.token}`);
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
