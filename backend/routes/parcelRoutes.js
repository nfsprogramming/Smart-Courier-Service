const express = require("express");
const {
  createParcel,
  getMyParcels,
  trackParcel,
  getAllParcels,
  updateStatus,
  assignCourier,
  getCourierParcels,
} = require("../controllers/parcelController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createParcel);
router.get("/my", protect, getMyParcels);
router.get("/courier", protect, getCourierParcels);
router.get("/track/:trackingId", trackParcel);
router.get("/", protect, adminOnly, getAllParcels);
router.put("/:id/status", protect, updateStatus);
router.put("/:id/assign", protect, adminOnly, assignCourier);

module.exports = router;
