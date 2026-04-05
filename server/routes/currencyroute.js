const express = require("express");
const router = express.Router();
const currencyController = require("../controller/currencycontroller");
const { verifyToken, hasPermission } = require("../middleware/auth");

router.get("/allcurrency", currencyController.getAllCurrencies);
router.get("/activecurrency", currencyController.getActiveCurrencies);

router.post("/createcurrency", verifyToken, hasPermission, currencyController.createCurrency);

router.put("/updatecurrency/:id", verifyToken, hasPermission, currencyController.updateCurrency);
router.put("/updatecurrencyrate/:id", verifyToken, hasPermission, currencyController.updateExchangeRate);
router.put("/deactivatecurrency/:id", verifyToken, hasPermission, currencyController.deactivateCurrency);

// Optional: bulk update exchange rates
router.put("/updatemultirates", verifyToken, hasPermission, currencyController.updateMultipleExchangeRates);

module.exports = router;