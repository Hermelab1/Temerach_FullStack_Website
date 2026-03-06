const db = require("../models");
const { Op, where } = require("sequelize");
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/* ================= CONTROLLERS ================= */

// Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await db.Testimonial.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

// Get active testimonials only
const getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await db.Testimonial.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });

    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({ message: "No active testimonials found" });
    }

    res.status(200).json(testimonials);
  } catch (err) {
    console.error("Error fetching active testimonials:", err);
    res.status(500).json({ message: "Failed to fetch active testimonials" });
  }
};

// Add new testimonial
const addTestimonial = async (req, res) => {
  try {
    const { name, designation, message, isActive } = req.body;
    let Flag = null;
    let companylogo = null; // Changed from CompanyLogo

    if (req.files) {
      if (req.files.Flag) Flag = req.files.Flag[0].filename;
      if (req.files.companylogo) companylogo = req.files.companylogo[0].filename; // Match lowercase 'l'
    }

    const newTestimonial = await db.Testimonial.create({
      name,
      designation,
      message,
      companylogo, // Match model field name
      Flag,
      isActive: isActive === '1' || isActive === 'true' || true,
    });

    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error("Error adding testimonial:", err);
    res.status(500).json({ message: "Failed to add testimonial" });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, message, isActive } = req.body;

    const testimonial = await db.Testimonial.findOne({ where: { id } });

    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    if (req.files) {
      if (req.files.Flag) testimonial.Flag = req.files.Flag[0].filename;
      if (req.files.companylogo) testimonial.companylogo = req.files.companylogo[0].filename; // Match lowercase 'l'
    }

    testimonial.name = name ?? testimonial.name;
    testimonial.designation = designation ?? testimonial.designation;
    testimonial.message = message ?? testimonial.message;
    testimonial.isActive = isActive !== undefined ? (isActive === '1' || isActive === 'true') : testimonial.isActive;

    await testimonial.save();
    res.status(200).json(testimonial);
  } catch (err) {
    console.error("Error updating testimonial:", err);
    res.status(500).json({ message: "Failed to update testimonial" });
  }
};
/* ================= EXPORT ================= */
module.exports = {
  upload, // For handling file uploads
  getAllTestimonials,
  getActiveTestimonials,
  addTestimonial,
  updateTestimonial,
};
