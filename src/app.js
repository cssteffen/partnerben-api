require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { CLIENT_ORIGIN } = require("./config");
const usersRouter = require("./users/users-router");
const paycheckRouter = require("./paycheck/paycheck-router");
const authRouter = require("./auth/auth-router");

const app = express();
//const PORT = process.env.PORT || 3000;
//app.get("/api/*", (req, res) => {
//res.json({ ok: true });
//});

const morganOption = NODE_ENV === "production" ? "tiny" : "common"; //or use dev in place of common

app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//const users = require("../test/test-helper");
//app.use("/api/users", (req, res) => {
//  res.json(users);
//});

app.use("/api/users", usersRouter);
app.use("/api/paystubs", paycheckRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

//production app hides error messages from users & malicious parties
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
