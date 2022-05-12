const express = require("express");
const { protect } = require("../controllers/authController/authController");
const { getPhotosURLsFirebase, uploadImages } = require("../controllers/photosController/photosController");

const router = express.Router();

router.route("/").post(protect, uploadImages, getPhotosURLsFirebase);

module.exports = router;
