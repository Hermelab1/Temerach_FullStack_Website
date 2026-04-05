const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Item = db.Item;
const ItemPriceLevel = db.ItemPriceLevel;
const Category = db.Category;
const UOM = db.UOM;

/* ===============================
   Upload Configuration
================================ */

const UPLOADS_DIR = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/webp") {
      cb(null, true);
    } else {
      cb(new Error("Only .webp format allowed"), false);
    }
  },
});

/* ===============================
   GET ALL ITEMS
================================ */

const getItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: ItemPriceLevel,
          as: "priceLevels",
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "categoryName", "subCategory"],
            },
          ],
        },
        {
          model: UOM,
          as: "uom",
          attributes: ["id", "uomName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(items);
  } catch (error) {
    console.error("[Fetch Items Error]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ===============================
   ADD ITEM + PRICE LEVEL
================================ */

const addItem = async (req, res) => {
  try {
    const {
      itemName,
      itemCode,
      description,
      uomId,
      stockQty,
      isTaxable,
      isActive,
      transactionAllowed,
      categoryId,
      unitPrice,
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    /* Create Item */
    const newItem = await Item.create({
      itemName,
      itemCode,
      description,
      uomId,
      stockQty,
      imageUrl,
      isTaxable,
      isActive,
      transactionAllowed,
    });

    /* Save Price Level */
    if (categoryId && unitPrice) {
      await ItemPriceLevel.create({
        itemId: newItem.id,
        categoryId,
        unitPrice,
      });
    }

    return res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("[Add Item Error]:", error);

    return res.status(500).json({
      message: "Failed to create item",
      error:
        error.name === "SequelizeUniqueConstraintError"
          ? "Item code already exists"
          : error.message,
    });
  }
};

/* ===============================
   GET ACTIVE ITEMS
================================ */

const getActiveItems = async (req, res) => {
  try {
    const activeItems = await Item.findAll({
      where: { isActive: true },
      include: [
        {
          model: ItemPriceLevel,
          as: "priceLevels",
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["categoryName", "subCategory"],
            },
          ],
        },
        {
          model: UOM,
          as: "uom",
          attributes: ["uomName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(activeItems);
  } catch (error) {
    console.error("[Fetch Active Items Error]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ===============================
   UPDATE ITEM + PRICE LEVEL
================================ */

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      itemName,
      itemCode,
      description,
      uomId,
      stockQty,
      isActive,
      isTaxable,
      transactionAllowed,
      categoryId,
      unitPrice,
    } = req.body;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : item.imageUrl;

    await item.update({
      itemName,
      itemCode,
      description,
      uomId,
      stockQty,
      imageUrl,
      isTaxable,
      isActive,
      transactionAllowed,
    });

    /* Update or create price level */

    if (categoryId && unitPrice) {
      const priceLevel = await ItemPriceLevel.findOne({
        where: { itemId: id, categoryId },
      });

      if (priceLevel) {
        await priceLevel.update({ unitPrice });
      } else {
        await ItemPriceLevel.create({
          itemId: id,
          categoryId,
          unitPrice,
        });
      }
    }

    return res.json({
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    console.error("[Update Item Error]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ===============================
   DEACTIVATE ITEM
================================ */

const deactivateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Item.update(
      { isActive: false },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({
      message: "Item marked as unavailable",
    });
  } catch (error) {
    console.error("[Deactivate Error]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  getItems,
  addItem,
  getActiveItems,
  deactivateItem,
  updateItem,
  upload,
};