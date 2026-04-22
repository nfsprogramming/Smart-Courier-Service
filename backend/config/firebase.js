const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let initialized = false;

if (!admin.apps.length) {
  try {
    // Production: use environment variable (Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      initialized = true;
      console.log("✅ Firebase Admin Connected (via ENV)");
    } else {
      // Local dev: use serviceAccountKey.json file
      const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        initialized = true;
        console.log("✅ Firebase Admin Connected (via file)");
      } else {
        console.error("❌ Firebase: No credentials found. Set FIREBASE_SERVICE_ACCOUNT env var or add serviceAccountKey.json");
      }
    }
  } catch (err) {
    console.error("❌ Firebase init error:", err.message);
  }
} else {
  initialized = true;
}

const db = initialized ? admin.firestore() : null;

module.exports = { admin, db };

