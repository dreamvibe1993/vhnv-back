const { Schema, model } = require("mongoose");

const songSchema = new Schema({
  band: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  lyrics: {
    type: String,
    required: true,
  },
});

const Song = model("Song", songSchema);

module.exports = Song;
