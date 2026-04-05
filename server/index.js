const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const seedAdmin = require('./seeders/seeddata');
const seedModules = require('./seeders/seedmodules');
const crypto = require("crypto");

/* ================= DATABASE ================= */
const { sequelize, createDatabaseIfNotExists } = require("./config/db");

/* ================= ROUTES ================= */
const loginRouter = require("./routes/loginRoute");
const blogRouter = require("./routes/blogs");
const categoriesRouter = require("./routes/categories");
const roleRoute = require("./routes/roleRoute");
const itemRouter = require("./routes/item");
const employeeRouter = require("./routes/employee");
const contactRouter = require("./routes/contactus");
const uomRouter = require("./routes/uomroute");
const testimonialRoute = require("./routes/testimonialRoute");
const orderRoute = require("./routes/order");
const currencyRoute = require("./routes/currencyroute");
const dashboardroute = require("./routes/dashboardroute");

// ✅ IMPORTANT: payment integration route
const paymentintegrationRoute = require("./routes/paymentintegrationRoute");

/* ================= APP ================= */
const app = express();
const PORT = process.env.PORT || 4001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ================= STATIC ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= SOCKET ================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});
app.set("socketio", io);

/* ================= ROUTES ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // IMPORTANT for CyberSource callbacks
// ✅ KEEP ALL GENERAL ROUTES
app.use("/api", loginRouter);
app.use("/api", blogRouter);
app.use("/api", categoriesRouter);
app.use("/api", roleRoute);
app.use("/api", itemRouter);
app.use("/api", employeeRouter);
app.use("/api", testimonialRoute);
app.use("/api", contactRouter);
app.use("/api", uomRouter);
app.use("/api", orderRoute);
app.use("/api", currencyRoute);
app.use("/api", dashboardroute); // Dashboard routes

// ✅ PAYMENT ROUTES NAMESPACED
app.use("/api", paymentintegrationRoute);

/* ================= ERROR HANDLER ================= */
app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(500).json({ message: "Internal server error" });
});



// ================= HASHER =================
app.post("/hasher", async (req, res) => {
  try {
    const data = req.body;

    const db = require("./models");
    const PaymentIntegration = db.PaymentIntegration;
    const crypto = require("crypto");

    const ALGORITHM = "aes-256-cbc";

    const KEY = crypto
      .createHash("sha256")
      .update(process.env.ENCRYPTION_KEY || "default_secret_key_32")
      .digest();

    const decrypt = (text) => {
      if (!text || !text.startsWith("enc:")) return text;

      try {
        const parts = text.split(":");
        const iv = Buffer.from(parts[1], "hex");
        const encryptedText = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
      } catch {
        return "";
      }
    };

    // ✅ Get payment config
    const config = await PaymentIntegration.findOne({
      where: { providerCode: "cybersource_hosted_sa" },
    });

    if (!config) {
      return res.status(500).json({ message: "Payment config not found" });
    }

    // ✅ Decrypt secret key
    const secretKey = decrypt(config.secretKey);

    if (!secretKey) {
      return res.status(500).json({ message: "Secret key missing" });
    }

    // ✅ Build signature string
    const fieldList = data.signed_field_names.split(",");

    const dataToSign = fieldList
      .map((field) => `${field}=${data[field] || ""}`)
      .join(",");

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("base64");

    res.json({ signature });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hasher error" });
  }
});

/* ================= START SERVER ================= */
async function startServer() {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    await sequelize.sync();

    await seedAdmin();
    await seedModules();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup failed:", error);
  }
}

startServer();