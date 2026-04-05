const db = require("../models");
const { Op } = require("sequelize");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= UPLOAD CONFIG ================= */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ================= GET ALL BLOGS ================= */
const getallblogs = async (req, res) => {
  try {
    const blogs = await db.blog.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* ================= ADD BLOG ================= */
const addblogs = async (req, res) => {
  try {
    const { blogcode, blogTitle, blogDescription, blogdate, isActive } = req.body;

    // Validation
    if (!blogcode || !blogTitle || !blogDescription || !blogdate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await db.blog.findOne({
      where: {
        [Op.or]: [{ blogcode }, { blogTitle }],
      },
    });

    if (exists) {
      return res.status(409).json({ message: "Blog already exists" });
    }

    const mediaSrc = req.file ? `/uploads/${req.file.filename}` : null;

    // The fix: Map the variable 'blogdate' to the model key 'bologdate'
    const blog = await db.blog.create({
      blogcode,
      blogTitle,
      blogDescription,
      bologdate: blogdate, 
      mediaSrc,
      isActive: isActive == 1 || isActive === "true",
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("Error in addblogs:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/* ================= UPDATE BLOG ================= */
const updateblog = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogTitle, blogDescription, blogdate, isActive } = req.body;

    const blog = await db.blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    let mediaSrc = blog.mediaSrc;

    if (req.file) {
      if (mediaSrc) {
        const oldFile = path.join(__dirname, "..", mediaSrc);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }
      mediaSrc = `/uploads/${req.file.filename}`;
    }

    // The fix: Ensure blogdate is passed to bologdate
    await blog.update({
      blogTitle,
      blogDescription,
      bologdate: blogdate,
      mediaSrc,
      isActive: isActive == 1 || isActive === "true",
    });

    res.json({ message: "Blog updated", blog });
  } catch (err) {
    console.error("Error in updateblog:", err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

/* ================= GET BLOG BY ID ================= */
const getblogbyid = async (req, res) => {
  try {
    const blog = await db.blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

/* ================= GET ACTIVE BLOGS ================= */
const getActiveBlog = async (req, res) => {
  try {
    const blogs = await db.blog.findAll({
      where: { isActive: true }
    });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No active blogs found" });
    }

    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching active blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* ================= STATS INCREMENTORS ================= */
const incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.increment("viewCount");
    res.json({ viewCount: blog.viewCount + 1 });
  } catch (err) {
    res.status(500).json({ message: "Failed to update view count" });
  }
};

const incrementLike = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.increment("likeCount");
    res.json({ likeCount: blog.likeCount + 1 });
  } catch (err) {
    res.status(500).json({ message: "Failed to update like count" });
  }
};

const incrementShare = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.increment("shareCount");
    res.json({ shareCount: blog.shareCount + 1 });
  } catch (err) {
    res.status(500).json({ message: "Failed to update share count" });
  }
};

module.exports = {
  upload,
  getallblogs,
  getActiveBlog,
  addblogs,
  updateblog,
  getblogbyid,
  incrementView,
  incrementLike,
  incrementShare,
};