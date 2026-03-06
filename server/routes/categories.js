const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController"); // adjust path if needed
const { verifyToken, hasPermission } = require("../middleware/auth");

// ================= GET ALL CATEGORIES =================
router.get("/allcategory", categoryController.getAllCategory);

// ================= ADD CATEGORY =================
router.post("/addcategory", verifyToken, hasPermission, categoryController.addCategory);

// ================= UPDATE CATEGORY =================
router.put("/updatecategory/:id", verifyToken, hasPermission, categoryController.updateCategory);

module.exports = router;
