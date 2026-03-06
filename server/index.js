const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const seedAdmin = require('./seeders/seeddata');


/* ================= DATABASE ================= */
const { sequelize, createDatabaseIfNotExists } = require("./config/db");
const db = require("./models"); // loads all Sequelize models

/* ================= ROUTES ================= */
const loginRouter = require("./routes/loginRoute");
const blogRouter = require("./routes/blogs");
const categoriesRouter = require("./routes/categories");
const roleRoute = require("./routes/roleRoute");
//const itemRouter = require("./routes/item");
const employeeRouter = require("./routes/employee");

const contactRouter = require("./routes/contactus");
//const ourTouch = require("./routes/ourtouch");
const testimonialRoute = require("./routes/testimonialRoute");
//const orderRoute = require("./routes/order");
//const paymentRoute = require("./routes/paymentRoute");

/* ================= APP SETUP ================= */
const app = express();
const PORT = process.env.PORT || 4001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/* ================= LOG ENV ================= */
console.log("Environment Loaded:", {
  PORT,
  MERCHANT_ID: process.env.MERCHANT_ID || "Not Set",
  SECRET_KEY: process.env.SECRET_KEY ? "Loaded" : "Missing",
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

/* ================= SOCKET.IO ================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});
app.set("socketio", io);

/* ================= ROUTES ================= */
app.use("/api", loginRouter);
app.use("/api", blogRouter);
app.use("/api", categoriesRouter);
app.use("/api", roleRoute);
//app.use("/api", itemRouter);
app.use("/api", employeeRouter);
//app.use("/api", ourTouch);
app.use("/api", testimonialRoute);
app.use("/api", contactRouter);
//app.use("/api", orderRoute);
//app.use("/api", paymentRoute);

/* ================= ERROR HANDLER ================= */
app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(500).json({ message: "Internal server error" });
});



async function startServer() {
  try {
    await createDatabaseIfNotExists();
    console.log('✅ Database temerachicoffeedb checked/created.');

    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // ❌ DO NOT USE alter:true
    await sequelize.sync();
    console.log('✅ All tables synchronized.');

    await seedAdmin();
    console.log('✅ SystemAdmin seeded.');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
}

startServer();
