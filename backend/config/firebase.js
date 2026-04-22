const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let initialized = false;

if (!admin.apps.length) {
  try {
    // Priority 1: Individual Environment Variables (More stable on Vercel)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      initialized = true;
      console.log("✅ Firebase Admin Connected (via Individual ENV)");
    } 
    // Priority 2: Full JSON string in environment variable
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      initialized = true;
      console.log("✅ Firebase Admin Connected (via JSON ENV)");
    } 
    // Priority 3: Local serviceAccountKey.json file
    else {
      const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        initialized = true;
        console.log("✅ Firebase Admin Connected (via file)");
      } else {
        console.error("❌ Firebase: No credentials found in ENV or file.");
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

