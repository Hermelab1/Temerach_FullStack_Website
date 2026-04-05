const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemsController"); // adjust path if needed
const { verifyToken, hasPermission } = require("../middleware/auth");

// ================= GET ALL ITEMS =================
router.get("/allitems", itemController.getItems);

// ================= ADD ITEM =================
router.post("/additem", verifyToken, hasPermission, itemController.upload.single("image"), itemController.addItem);

// ================= GET ITEM BY ID =================
router.get("/getactiveitem", itemController.getActiveItems);

// ================= UPDATE ITEM =================
router.put("/updateitem/:id", verifyToken, hasPermission, itemController.upload.single("image"), itemController.updateItem);

// ================= DELETE ITEM =================
router.delete("/disactiveitem/:id", verifyToken, hasPermission, itemController.deactivateItem);

// ================= UPDATE ACTIVE ITEMS =================
router.put("/updateactiveitem/:id", verifyToken, hasPermission, itemController.updateItem);

module.exports = router;