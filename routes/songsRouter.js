const express = require("express");
const { getAllSongs } = require("../controllers/songController/songController");

const router = express.Router();

router.route("/").get(getAllSongs);

module.exports = router;
