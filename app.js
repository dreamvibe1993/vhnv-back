const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController/errorController");

const songRouter = require("./routes/songsRouter");

// ****
const app = express();
// ****

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use((req, res, next) => {
  next();
});

app.use(`${process.env.API_ROUTE_V1}/songs`, songRouter);

app.use(globalErrorHandler);

module.exports = app;
