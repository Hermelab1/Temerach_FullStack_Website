const express = require("express");
const router = express.Router();

const {
  getPaymentSettings,
  updatePaymentIntegration,
  generateSignature,
} = require("../controller/paymentintegration");

const { verifyToken, hasPermission } = require("../middleware/auth");

// Routes
router.get("/settings", verifyToken, hasPermission, getPaymentSettings);
router.put("/update", verifyToken, hasPermission, updatePaymentIntegration);
router.post("/signature", generateSignature);


module.exports = router;