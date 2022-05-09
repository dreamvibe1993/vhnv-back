const express = require("express");
const {
  getAllSongs,
  postSong,
  getSongAlpabetically,
  deleteSong,
} = require("../controllers/songController/songController");

const router = express.Router();

router.route("/").get(getAllSongs).post(postSong);

router.route("/:id").delete(deleteSong);

router.route("/:letter").get(getSongAlpabetically);

module.exports = router;
