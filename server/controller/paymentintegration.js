require("dotenv").config();
const db = require("../models");
const PaymentIntegration = db.PaymentIntegration;
const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";

const KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();

// ================= ENCRYPT =================
const encrypt = (text) => {
  if (!text) return text;

  if (typeof text === "string" && text.startsWith("enc:")) return text;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");

  return `enc:${iv.toString("hex")}:${encrypted}`;
};

// ================= DECRYPT =================
const decrypt = (text) => {
  if (!text || typeof text !== "string") return text;
  if (!text.startsWith("enc:")) return text;

  try {
    const [_, ivHex, encryptedText] = text.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    return "";
  }
};

// ================= GET SETTINGS =================
exports.getPaymentSettings = async (req, res) => {
  try {
    let config = await PaymentIntegration.findOne({
      where: { providerCode: "cybersource_hosted_sa" },
    });

    // Create default if not exists
    if (!config) {
      config = await PaymentIntegration.create({
        providerCode: "cybersource_hosted_sa",
        merchantId: "",
        profileId: "",
        accessKey: "",
        secretKey: "",
        transactionType: "sale",
      });
    }

    const data = config.get({ plain: true });

    // Decrypt sensitive fields
    data.merchantId = decrypt(data.merchantId);
    data.profileId = decrypt(data.profileId);

    // Do NOT expose real keys
    data.accessKey = decrypt(data.accessKey)
    data.secretKey = decrypt(data.secretKey)

    res.json(data);
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    res.status(500).json({ message: "Error fetching settings" });
  }
};

// ================= UPDATE SETTINGS =================
exports.updatePaymentIntegration = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const integration = await PaymentIntegration.findOne({
      where: { providerCode: "cybersource_hosted_sa" },
    });

    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }

    const sensitiveFields = [
      "merchantId",
      "profileId",
      "accessKey",
      "secretKey",
    ];

    // Encrypt only changed values
    sensitiveFields.forEach((field) => {
      if (
        updateData[field] &&
        updateData[field] !== "********" &&
        !updateData[field].startsWith("enc:")
      ) {
        updateData[field] = encrypt(updateData[field]);
      } else {
        // Prevent overwriting with mask
        delete updateData[field];
      }
    });

    await integration.update(updateData);

    res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// ================= SIGNATURE =================
exports.generateSignature = async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    const config = await PaymentIntegration.findOne({
      where: { providerCode: "cybersource_hosted_sa" },
    });

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    const accessKey = decrypt(config.accessKey);
    const secretKey = decrypt(config.secretKey);
    const profileId = decrypt(config.profileId);

    if (!accessKey || !secretKey || !profileId) {
      return res.status(400).json({
        message: "Invalid payment configuration",
      });
    }

    const safeAmount = Number(amount).toFixed(2);
    const signedDateTime = new Date().toISOString().slice(0, 19) + "Z";
    const uuid = crypto.randomUUID();

    // ✅ FIXED: EXACT ORDER (DO NOT CHANGE)
const signed_field_names =
  "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,override_custom_receipt_page,override_custom_cancel_page";
    const fields = {
      access_key: accessKey,
      profile_id: profileId,
      transaction_uuid: uuid,
      signed_field_names: signed_field_names,
      unsigned_field_names: "",
      signed_date_time: signedDateTime,
      locale: "en",
      transaction_type: "sale",
      reference_number: orderId,
      amount: safeAmount,
      currency: currency || "USD",

      override_custom_receipt_page: "https://localhost:4001/api/cybersource/callback",
      override_custom_cancel_page: "http://localhost:3000/payment-failed",
    };

    // ✅ Build string EXACTLY in same order
    const dataToSign = signed_field_names
      .split(",")
      .map((field) => `${field}=${fields[field]}`)
      .join(",");

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("base64");

    res.json({
      success: true,
      endpoint: "https://secureacceptance.cybersource.com/pay",
      fields,
      signature,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Signature error",
      error: err.message,
    });
  }
};