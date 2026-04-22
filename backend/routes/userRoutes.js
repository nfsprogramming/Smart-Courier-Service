const express = require("express");
const { db } = require("../config/firebase");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/couriers", protect, adminOnly, async (req, res) => {
  try {
    const snapshot = await db.collection("users").where("role", "==", "courier").get();
    const couriers = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.password;
      return { _id: doc.id, ...data };
    });
    res.json(couriers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
