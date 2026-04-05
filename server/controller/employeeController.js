const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Sequelize } = require('sequelize'); 

// Upload directory setup
const uploadsDir = path.join(__dirname, "../uploads/employees");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

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

    // 1. Basic Validation
    if (!firstName || !lastName || !position || !category) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    // 2. Prepare Email (Handle empty strings as null)
    const processedEmail = (email && email.trim() !== "") ? email.trim() : null;

    // 3. Unique Check (Only if email is provided)
    if (processedEmail) {
      const existing = await db.Employee.findOne({ where: { email: processedEmail } });
      if (existing) {
        return res.status(409).json({ error: "Email already exists." });
      }
    }

    const profileImage = req.file ? `/uploads/employees/${req.file.filename}` : null;

    // 4. Create Record
    const employee = await db.Employee.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: processedEmail, // Will be null if empty, works IF model allowsNull
      phone,
      position,
      memo,
      profileImage,
      category,
      isActive: isActive === "1" || isActive === "true" || isActive === true,
    });

    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error) {
    console.error("Creation Error:", error);
    
    // Catch specific Sequelize errors to give better feedback
    if (error.name === 'SequelizeUniqueConstraintError') {
       return res.status(409).json({ error: "This email is already in use." });
    }
    
    res.status(500).json({ error: "Failed to create employee" });
  }
}
// --- UPDATE EMPLOYEE ---
async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const employee = await db.Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const { firstName, lastName, email, phone, position, memo, category, isActive } = req.body;

    // Only validate email format if a value exists
    if (email && email.trim() !== "") {
      const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegexp.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }
    }

    const profileImage = req.file 
      ? `/uploads/employees/${req.file.filename}` 
      : employee.profileImage;

    await employee.update({
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      email: (email && email.trim() !== "") ? email.trim() : employee.email,
      phone: phone || employee.phone,
      position: position || employee.position,
      memo: memo || employee.memo,
      profileImage,
      category: category || employee.category,
      isActive: isActive === "1" || isActive === "true" || isActive === true,
    });

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to update employee" });
  }
}

// Helper functions 
async function getAllEmployees(req, res) {
  try {
    const employees = await db.Employee.findAll({ order: [["createdAt", "DESC"]] });
    res.json(employees);
  } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
}

async function getEmployeeById(req, res) {
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: "Not found" });
    res.json(employee);
  } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
}

async function deleteEmployee(req, res) {
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: "Not found" });
    await employee.update({ isActive: false });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ error: "Delete failed" }); }
}

// Ensure Sequelize is imported
async function getActiveEmployee(req, res) {
  try {
    const employees = await db.Employee.findAll({
      where: { isActive: true },
      // Custom order: Managers (1) then Employees (2)
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN category = 'Manager' THEN 1 
              WHEN category = 'Employee' THEN 2 
              ELSE 3 
            END
          `), 
          "ASC"
        ],
        ["createdAt"] // Secondary sort by date
      ]
    });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No active employees found" });
    }

    const formattedEmployees = employees.map(emp => ({
      id: emp.id,
      FullName: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
      EmpImage: emp.profileImage,
      Memo: emp.memo,
      Positions: emp.position,
      Category: emp.category
    }));

    return res.status(200).json(formattedEmployees);
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}


// Get employees by category (e.g., "Management")
async function getEmployeesByCategory(req, res) {
  try {
    // 1. Extract category from query params
    const category = req.query.category || "Manager";

    // 2. Query the database
    const employees = await db.Employee.findAll({
      where: { 
        isActive: true, 
        category: category 
      },
      order: [["createdAt"]]
    });

    // 3. Handle case where no employees are found
    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: `No active employees found for category: ${category}` });
    }

    // 4. Map the data safely
    const formattedEmployees = employees.map(emp => ({
      id: emp.id,
      FullName: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
      EmpImage: emp.profileImage || 'default-avatar.png', // Fallback image
      Memo: emp.memo,
      Positions: emp.position,
      Category: emp.category
    }));

    // 5. Send success response
    return res.status(200).json(formattedEmployees);

  } catch (err) {
    console.error("Error fetching employees by category:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { addEmployee, getEmployeesByCategory, getActiveEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, upload };