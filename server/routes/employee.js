const express = require("express");
const router = express.Router();

const { verifyToken, hasPermission } = require("../middleware/auth");

const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  upload,
} = require("../controller/employeeController");


// ================= PUBLIC ROUTES =================

// 🔓 NO TOKEN REQUIRED
router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);


// ================= PROTECTED ROUTES =================

// 🔒 CREATE
router.post(
  "/addemployee",
  verifyToken,
  hasPermission,
  upload.single("profileImage"),
  addEmployee
);

// 🔒 UPDATE
router.put(
  "/updateemployee/:id",
  verifyToken,
  hasPermission,
  upload.single("profileImage"),
  updateEmployee
);

// 🔒 DELETE
router.delete(
  "/employees/:id",
  verifyToken,
  hasPermission,
  deleteEmployee
);

module.exports = router;