const Blog = require("../../models/blog/Blog");
const { STATUS_SUCCESS } = require("../../configs/statuses/statuses");
const { catchAsync } = require("../../utils/Errors/catchAsync/catchAsync");
const AppError = require("../../utils/Errors/Error");

exports.addBlog = catchAsync(async (req, res, next) => {
  await Blog.create({
    title: req.body.title,
    date: req.body.date,
    author: req.body.author,
    content: req.body.content,
    photos: req.body.photos,
  });

  res.status(200).json({
    status: STATUS_SUCCESS,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("No blog found with that id", 404));
  blog.delete();
  res.status(200).json({
    status: STATUS_SUCCESS,
    message: `Blog by id: ${req.params.id} is deleted!`,
  });
});

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();
  if (!blogs) return next(new AppError("No blogs found", 404));
  res.status(200).json({
    status: STATUS_SUCCESS,
    length: blogs.length,
    blogs,
  });
});
