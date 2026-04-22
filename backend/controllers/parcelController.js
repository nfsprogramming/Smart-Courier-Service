const { db } = require("../config/firebase");
const generateTrackingId = require("../utils/generateTrackingId");

const calculateCost = (weight, type) => {
  let baseCost = 50;
  let perKg = 20;
  const typeMultiplier = { document: 1, package: 1.2, fragile: 1.5, electronics: 1.8 };
  return Math.round((baseCost + perKg * weight) * (typeMultiplier[type] || 1));
};

exports.createParcel = async (req, res) => {
  try {
    const { receiverName, receiverPhone, receiverAddress, pickupAddress, weight, parcelType } = req.body;

    const cost = calculateCost(weight, parcelType);
    const trackingId = generateTrackingId();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const parcelData = {
      trackingId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      receiverName,
      receiverPhone,
      receiverAddress,
      pickupAddress,
      weight: Number(weight),
      parcelType,
      cost,
      status: "pending",
      assignedCourierId: null,
      estimatedDelivery: estimatedDelivery.toISOString(),
      createdAt: new Date().toISOString(),
      trackingHistory: [{ status: "pending", location: pickupAddress, timestamp: new Date().toISOString() }],
    };

    const docRef = await db.collection("parcels").add(parcelData);
    res.status(201).json({ _id: docRef.id, ...parcelData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyParcels = async (req, res) => {
  try {
    const snapshot = await db.collection("parcels").where("senderId", "==", req.user._id).get();
    const parcels = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.trackParcel = async (req, res) => {
  try {
    const snapshot = await db.collection("parcels").where("trackingId", "==", req.params.trackingId).get();
    if (snapshot.empty) return res.status(404).json({ message: "Parcel not found" });
    
    const data = snapshot.docs[0].data();
    const parcel = { 
        _id: snapshot.docs[0].id, 
        ...data,
        sender: { name: data.senderName, email: data.senderEmail },
        assignedCourier: { name: data.assignedCourierName || "Unassigned" }
    };
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllParcels = async (req, res) => {
  try {
    const snapshot = await db.collection("parcels").get();
    const parcels = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        _id: doc.id, 
        ...data,
        sender: { name: data.senderName, email: data.senderEmail },
        assignedCourier: { _id: data.assignedCourierId, name: data.assignedCourierName }
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const parcelRef = db.collection("parcels").doc(req.params.id);
    const doc = await parcelRef.get();
    if (!doc.exists) return res.status(404).json({ message: "Not found" });

    const parcelData = doc.data();
    const newHistory = [...parcelData.trackingHistory, { status, location, timestamp: new Date().toISOString() }];
    
    await parcelRef.update({ status, trackingHistory: newHistory });
    res.json({ _id: doc.id, ...parcelData, status, trackingHistory: newHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignCourier = async (req, res) => {
  try {
    const { courierId } = req.body;
    const courierDoc = await db.collection("users").doc(courierId).get();
    
    await db.collection("parcels").doc(req.params.id).update({
      assignedCourierId: courierId,
      assignedCourierName: courierDoc.exists ? courierDoc.data().name : "Unknown"
    });
    res.json({ message: "Courier assigned" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourierParcels = async (req, res) => {
  try {
    const snapshot = await db.collection("parcels").where("assignedCourierId", "==", req.user._id).get();
    const parcels = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
