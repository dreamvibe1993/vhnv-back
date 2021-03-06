const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const { catchAsync } = require("../../utils/Errors/catchAsync/catchAsync");

const User = require("../../models/user/User");
const AppError = require("../../utils/Errors/Error");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    path: "/",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  await User.create({
    password: req.body.password,
  });
  res.status(201).json({
    status: "success",
  });
  // createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError("Nope... Uh uh...", 400));
  }

  const user = await User.findOne({ name: process.env.ADMIN_USERNAME }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Nope...", 401));
  }
  createSendToken(user, 200, res);
});

exports.sendOKStatus = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "Logged in",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please login.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("This user does not exist anymore.", 401));
  }

  req.user = freshUser;

  next();
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
