const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload directory
const uploadsDir = path.join(__dirname, "../uploads/employees");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
  },
});

//Add new employee
async function addEmployee(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      memo,
      category,
      isActive,
    } = req.body;

    const profileImage = req.file
      ? `/uploads/employees/${req.file.filename}`
      : null;

    if (!firstName || !lastName || !email || !position || !category) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    const existing = await db.Employee.findOne({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ error: "Email already exists." });
    }

    const employee = await db.Employee.create({
      firstName,
      lastName,
      email,
      phone,
      position,
      memo,
      profileImage,
      category,
      isActive: isActive === "1" || isActive === true,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
}


// Get all employees
async function getAllEmployees(req, res) {
  try {
    const employees = await db.Employee.findAll({ order: [["createdAt", "DESC"]] });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

// Get employee by ID
async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const employee = await db.Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params;

    const employee = await db.Employee.findByPk(id);
    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      memo,
      category,
      isActive,
    } = req.body;

    const profileImage = req.file
      ? `/uploads/employees/${req.file.filename}`
      : employee.profileImage;

    await employee.update({
      firstName,
      lastName,
      email,
      phone,
      position,
      memo,
      profileImage,
      category,
      isActive: isActive === "1" || isActive === true,
    });

    res.json({
      message: "Employee updated successfully",
      employee,
    });

  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
}


async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;

    const employee = await db.Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    await employee.update({ isActive: false });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
}

module.exports = { addEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, upload };
