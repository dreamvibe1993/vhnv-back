const express = require("express");
const {
  getAllSongs,
  /*postSong,*/
  getSongAlpabetically,
} = require("../controllers/songController/songController");

const router = express.Router();

router.route("/").get(getAllSongs) /*.post(postSong)*/;

router.route("/:letter").get(getSongAlpabetically);

module.exports = router;
