const db = require("../models");
const { Op } = require("sequelize");

/* ================= GET ALL UOMs ================= */
const getAllUoms = async (req, res) => {
  try {
    const uoms = await db.UOM.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(uoms);
  } catch (error) {
    console.error("GET UOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch UOMs",
      error: error.message,
    });
  }
};

/* ================= GET ACTIVE UOMs ================= */
const getActiveUoms = async (req, res) => {
  try {
    const uoms = await db.UOM.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(uoms);
  } catch (error) {
    console.error("GET ACTIVE UOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch active UOMs",
      error: error.message,
    });
  }
};

/* ================= ADD UOM ================= */
const addUom = async (req, res) => {
  try {
    let { uomName, uomDescription, isActive } = req.body;

    if (!uomName || !uomDescription) {
      return res.status(400).json({
        message: "UOM name and description are required",
      });
    }

    uomName = uomName.trim();
    uomDescription = uomDescription.trim();

    const existingUom = await db.UOM.findOne({
      where: {
        uomName: {
          [Op.eq]: uomName,
        },
      },
    });

    if (existingUom) {
      return res.status(409).json({
        message: "UOM already exists",
      });
    }

    const newUom = await db.UOM.create({
      uomName,
      uomDescription,
      isActive: isActive === true || isActive === 1,
    });

    return res.status(201).json({
      message: "UOM created successfully",
      data: newUom,
    });
  } catch (error) {
    console.error("ADD UOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to create UOM",
      error: error.message,
    });
  }
};

/* ================= UPDATE UOM ================= */
const updateUom = async (req, res) => {
  try {
    const { id } = req.params;
    let { uomName, uomDescription, isActive } = req.body;

    const uom = await db.UOM.findByPk(id);

    if (!uom) {
      return res.status(404).json({
        message: "UOM not found",
      });
    }

    if (!uomName || !uomDescription) {
      return res.status(400).json({
        message: "UOM name and description are required",
      });
    }

    uomName = uomName.trim();
    uomDescription = uomDescription.trim();

    const existingUom = await db.UOM.findOne({
      where: {
        uomName: {
          [Op.eq]: uomName,
        },
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingUom) {
      return res.status(409).json({
        message: "UOM name already exists",
      });
    }

    await uom.update({
      uomName,
      uomDescription,
      isActive: isActive === true || isActive === 1,
    });

    return res.status(200).json({
      message: "UOM updated successfully",
      data: uom,
    });
  } catch (error) {
    console.error("UPDATE UOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to update UOM",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUoms,
  getActiveUoms,
  addUom,
  updateUom,
};