const db = require("../models");
const Currency = db.Currency;

// ===============================
// Get All Currencies
// ===============================
exports.getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(currencies);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    res.status(500).json({ message: "Failed to retrieve currencies", error: error.message });
  }
};

// ===============================
// Get Active Currencies
// ===============================
exports.getActiveCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll({ where: { isActive: true }, order: [["name", "ASC"]] });
    res.status(200).json(currencies);
  } catch (error) {
    console.error("Error fetching active currencies:", error);
    res.status(500).json({ message: "Failed to retrieve active currencies", error: error.message });
  }
};

// ===============================
// Create Currency
// ===============================
exports.createCurrency = async (req, res) => {
  try {
    const { code, name, symbol, rate, isDefault } = req.body;

    if (!code || !name || !symbol) {
      return res.status(400).json({ message: "Code, name, and symbol are required" });
    }

    const existing = await Currency.findOne({ where: { code: code.toUpperCase() } });
    if (existing) return res.status(400).json({ message: "Currency already exists" });

    // If this currency is set as default, unset all other defaults
    if (isDefault) {
      await Currency.update({ isDefault: false }, { where: {} });
    }

    const currency = await Currency.create({
      code: code.toUpperCase(),
      name,
      symbol,
      rate: rate || 1,
      isDefault: !!isDefault,
      isActive: true,
    });

    res.status(201).json({ message: "Currency created successfully", data: currency });
  } catch (error) {
    console.error("Error creating currency:", error);
    res.status(500).json({ message: "Failed to create currency", error: error.message });
  }
};

// ===============================
// Update Currency
// ===============================
exports.updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, symbol, rate, isActive, isDefault } = req.body;

    const currency = await Currency.findByPk(id);
    if (!currency) return res.status(404).json({ message: "Currency not found" });

    // If updated currency is set as default, unset all other defaults
    if (isDefault) {
      await Currency.update({ isDefault: false }, { where: { id: { [db.Sequelize.Op.ne]: id } } });
    }

    await currency.update({
      code: code ? code.toUpperCase() : currency.code,
      name: name || currency.name,
      symbol: symbol || currency.symbol,
      rate: rate || currency.rate,
      isActive: typeof isActive === "boolean" ? isActive : currency.isActive,
      isDefault: !!isDefault,
    });

    res.status(200).json({ message: "Currency updated successfully", data: currency });
  } catch (error) {
    console.error("Error updating currency:", error);
    res.status(500).json({ message: "Failed to update currency", error: error.message });
  }
};

// ===============================
// Update Exchange Rate
// ===============================
exports.updateExchangeRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;

    if (!rate || isNaN(rate) || rate <= 0) {
      return res.status(400).json({ message: "Exchange rate must be a positive number" });
    }

    const currency = await Currency.findByPk(id);
    if (!currency) return res.status(404).json({ message: "Currency not found" });

    currency.rate = rate;
    await currency.save();

    res.status(200).json({ message: "Exchange rate updated successfully", data: currency });
  } catch (error) {
    console.error("Error updating exchange rate:", error);
    res.status(500).json({ message: "Failed to update exchange rate", error: error.message });
  }
};

// ===============================
// Deactivate Currency
// ===============================
exports.deactivateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByPk(id);
    if (!currency) return res.status(404).json({ message: "Currency not found" });

    currency.isActive = false;
    await currency.save();

    res.status(200).json({ message: "Currency deactivated successfully", data: currency });
  } catch (error) {
    console.error("Error deactivating currency:", error);
    res.status(500).json({ message: "Failed to deactivate currency", error: error.message });
  }
};

// ===============================
// Bulk Update Exchange Rates
// ===============================
exports.updateMultipleExchangeRates = async (req, res) => {
  try {
    const rates = req.body.rates; // [{id:1, rate:55.3}, ...]

    if (!Array.isArray(rates) || rates.length === 0) {
      return res.status(400).json({ message: "Rates array is required" });
    }

    for (const r of rates) {
      if (r.rate && r.id) {
        await Currency.update({ rate: r.rate }, { where: { id: r.id } });
      }
    }

    res.status(200).json({ message: "Exchange rates updated successfully" });
  } catch (error) {
    console.error("Error updating multiple rates:", error);
    res.status(500).json({ message: "Failed to update rates", error: error.message });
  }
};