const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controllers/errorController/errorController");

const songRouter = require("./routes/songsRouter");
const authRouter = require("./routes/authRouter");
const photoRouter = require("./routes/photoRouter");
const blogRouter = require("./routes/blogRouter");

const { corsDevConfig } = require("./configs/cors/cors");

const { TOO_MANY_REQUESTS } = require("./configs/errorMessages/errorMessages");

const jsonParser = bodyParser.json();

// *****
const app = express();
// *****

const limiter = rateLimit({
  max: 600,
  windowMs: 60 * 60 * 1000,
  message: TOO_MANY_REQUESTS,
});

app.use(helmet());
app.use("/api", limiter);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp(/* whitelist: [] */));
app.use(cors(process.env.NODE_ENV === "development" ? corsDevConfig : {}));
app.options("*", cors());
app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use((req, res, next) => {
  next();
});

app.use(`${process.env.API_ROUTE_V1}/songs`, jsonParser, songRouter);
app.use(`${process.env.API_ROUTE_V1}/auth`, jsonParser, authRouter);
app.use(`${process.env.API_ROUTE_V1}/photos`, jsonParser, photoRouter);
app.use(`${process.env.API_ROUTE_V1}/blog`, jsonParser, blogRouter);

app.use("/", cors(), express.static(path.resolve(__dirname, `./client`)));

app.use("*", (req, res, next) => res.sendFile(path.resolve(__dirname, "./client", "index.html")));

app.use(globalErrorHandler);

module.exports = app;

/**
 * TODO:
 * Protect
 */
