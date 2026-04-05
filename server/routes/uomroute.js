const express = require("express");
const router = express.Router();

const uomController = require("../controller/uomController");
const { verifyToken, hasPermission } = require("../middleware/auth");

/* ================= PUBLIC ROUTES ================= */

// Get all UOMs
router.get("/uoms", uomController.getAllUoms);

// Get active UOMs
router.get("/uomsactive", uomController.getActiveUoms);

/* ================= PROTECTED ROUTES ================= */

// Create UOM
router.post(
  "/adduom",
  verifyToken,
  hasPermission,
  uomController.addUom
);

// Update UOM
router.put(
  "/updateuom/:id",
  verifyToken,
  hasPermission,
  uomController.updateUom
);

module.exports = router;