const express = require("express");
const { signup, login, protect, sendOKStatus, logout } = require("../controllers/authController/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/status").get(protect, sendOKStatus);
router.route("/logout").post(logout);

module.exports = router;
