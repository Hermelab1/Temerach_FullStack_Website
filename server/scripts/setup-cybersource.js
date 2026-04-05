require("dotenv").config();
const db = require("../models");
const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY || "default_secret_key_32")
  .digest();

const encrypt = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");
  return `enc:${iv.toString("hex")}:${encrypted}`;
};

const setupCyberSource = async () => {
  try {
    // REPLACE WITH YOUR ACTUAL CYBERSOURCE TEST CREDENTIALS
    const CYBERSOURCE_CONFIG = {
      accessKey: "4927ba853df53389b59f93334686fa31",
      secretKey: "3113ebb7ac984904a042b054bbc6f437235b33e07c1d4d32acc6ae9c352765e2c87971377efe45e1be0ba8c663e389148c38cb13cdc64c2b9180e4d95e34c31b070627b4d48b4fdda0e7884ac4defde944fe25b8786441ac8c8dec7409a6f50fb1e745471c184737af3e32de55fdff97ea42da193752409b8a77e0c5dd016c31",
      profileId: "8C455EFF-171C-4AFC-A384-399215B4F53E",
      merchantId: "abyssinia_dm_acct"
    };

    console.log("🔐 Setting up CyberSource configuration...\n");

    const PaymentIntegration = db.PaymentIntegration;

    const [config, created] = await PaymentIntegration.findOrCreate({
      where: { providerCode: "cybersource_hosted_sa" },
      defaults: {
        providerCode: "cybersource_hosted_sa",
        accessKey: encrypt(CYBERSOURCE_CONFIG.accessKey),
        secretKey: encrypt(CYBERSOURCE_CONFIG.secretKey),
        profileId: encrypt(CYBERSOURCE_CONFIG.profileId),
        merchantId: encrypt(CYBERSOURCE_CONFIG.merchantId),
        transactionType: "sale",
        isActive: true
      }
    });

    if (!created) {
      await config.update({
        accessKey: encrypt(CYBERSOURCE_CONFIG.accessKey),
        secretKey: encrypt(CYBERSOURCE_CONFIG.secretKey),
        profileId: encrypt(CYBERSOURCE_CONFIG.profileId),
        merchantId: encrypt(CYBERSOURCE_CONFIG.merchantId)
      });
      console.log("✅ CyberSource configuration updated successfully!");
    } else {
      console.log("✅ CyberSource configuration created successfully!");
    }

    console.log("\n📝 Configuration Summary:");
    console.log(`   Provider: ${config.providerCode}`);
    console.log(`   Access Key: ${CYBERSOURCE_CONFIG.accessKey.substring(0, 10)}...`);
    console.log(`   Profile ID: ${CYBERSOURCE_CONFIG.profileId}`);
    console.log(`   Merchant ID: ${CYBERSOURCE_CONFIG.merchantId}`);
    console.log("\n🔒 All sensitive data encrypted at rest");

  } catch (error) {
    console.error("❌ Setup failed:", error);
  } finally {
    process.exit();
  }
};

setupCyberSource();