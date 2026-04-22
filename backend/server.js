require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/firebase");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const userRoutes = require("./routes/userRoutes");

// Mount routes to both /api and / for maximum compatibility (Vercel strips /api prefix)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/parcels", parcelRoutes);
app.use("/parcels", parcelRoutes);

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => res.send("🚚 Smart Courier API running..."));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}

module.exports = app;
