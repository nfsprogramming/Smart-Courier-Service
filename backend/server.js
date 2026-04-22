require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/firebase");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parcels", require("./routes/parcelRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => res.send("🚚 Smart Courier API running..."));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}

module.exports = app;
