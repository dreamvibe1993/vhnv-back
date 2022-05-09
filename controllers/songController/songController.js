const Song = require("../../models/song/Song");
const AppError = require("../../utils/Errors/Error");

const { catchAsync } = require("../../utils/Errors/catchAsync/catchAsync");

const { STATUS_SUCCESS } = require("../../configs/statuses/statuses");
const { NO_SONGS_ERR_MESSAGE, NO_SONGS_STARTS_WITH_LETTER } = require("../../configs/errorMessages/errorMessages");
const { findById } = require("../../models/song/Song");

exports.getAllSongs = catchAsync(async (req, res, next) => {
  const songs = await Song.find();
  if (!songs) return next(new AppError(NO_SONGS_ERR_MESSAGE, 404));
  res.status(200).json({
    status: STATUS_SUCCESS,
    length: songs.length,
    songs,
  });
});

exports.getSongAlpabetically = catchAsync(async (req, res, next) => {
  const songs = await Song.find({
    name: { $regex: "^" + req.params.letter, $options: "i" },
  });
  if (!songs) return next(new AppError(`${NO_SONGS_STARTS_WITH_LETTER} ${req.params.letter}`, 404));
  res.status(200).json({
    status: STATUS_SUCCESS,
    songs,
  });
});

exports.postSong = catchAsync(async (req, res, next) => {
  await Song.create(req.body);

  res.status(200).json({
    status: STATUS_SUCCESS,
    song: req.body,
  });
  next();
});

exports.deleteSong = catchAsync(async (req, res, next) => {
  const song = await Song.findById(req.params.id);
  if (!song) return next(new AppError("No song found with that id", 404));
  song.delete();
  res.status(200).json({
    status: STATUS_SUCCESS,
    message: `Song by id: ${req.params.id} is deleted!`,
  });
});
