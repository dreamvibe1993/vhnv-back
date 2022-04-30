const express = require("express");
const morgan = require("morgan");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use((req, res, next) => {
  next();
});

module.exports = app;
