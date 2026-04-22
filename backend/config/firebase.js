const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin Connected");
} else {
  console.error("❌ Firebase Admin Error: Missing serviceAccountKey.json");
  console.error("Please download it from Firebase Console -> Project Settings -> Service Accounts");
  console.error("And place it in the backend folder!");
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { admin, db };
