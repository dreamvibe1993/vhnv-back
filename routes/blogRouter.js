const express = require("express");
const { protect } = require("../controllers/authController/authController");
const { addBlog, deleteBlog, getAllBlogs } = require("../controllers/blogController/blogController");

const router = express.Router();

router.route("/").post(protect, addBlog).get(getAllBlogs);
router.route("/:id").delete(protect, deleteBlog);

module.exports = router;
