const express = require("express");
const { protect } = require("../controllers/authController/authController");
const {
  getAllSongs,
  postSong,
  getSongAlpabetically,
  deleteSong,
} = require("../controllers/songController/songController");

const router = express.Router();

router.route("/").get(getAllSongs).post(protect, postSong);

router.route("/:id").delete(protect, deleteSong);

router.route("/:letter").get(getSongAlpabetically);

module.exports = router;
