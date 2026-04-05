const express = require("express");
const router = express.Router();

const { verifyToken, hasPermission } = require("../middleware/auth");

const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  getActiveEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByCategory,
  upload,
} = require("../controller/employeeController");

// ================= PUBLIC ROUTES =================
// Ensure these have NO middleware like verifyToken
router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.get("/activeemployee", getActiveEmployee);
router.get("/employeebycat", getEmployeesByCategory); // Add this one for your story page

// ================= PROTECTED ROUTES =================
// Only routes that CHANGE data (POST, PUT, DELETE) should have verifyToken
router.post("/addemployee", verifyToken, hasPermission, upload.single("profileImage"), addEmployee);
router.put("/updateemployee/:id", verifyToken, hasPermission, upload.single("profileImage"), updateEmployee);
router.delete("/employees/:id", verifyToken, hasPermission, deleteEmployee);

module.exports = router;