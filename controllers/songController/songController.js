const Song = require("../../models/song/Song");
const AppError = require("../../utils/Errors/Error");

const { catchAsync } = require("../../utils/Errors/catchAsync/catchAsync");

const { STATUS_SUCCESS } = require("../../configs/statuses/statuses");

exports.getAllSongs = catchAsync(async (req, res, next) => {
  const songs = Song.find();
  if (!songs) return next(new AppError("No songs found!", 404));
  res.status(200).json({
    status: STATUS_SUCCESS,
    songs,
  });
});
