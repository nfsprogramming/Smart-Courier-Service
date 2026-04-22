const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userDoc = await db.collection("users").doc(decoded.id).get();
      if (!userDoc.exists) return res.status(401).json({ message: "User not found" });
      
      req.user = { _id: userDoc.id, ...userDoc.data() };
      delete req.user.password;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access required" });
};

module.exports = { protect, adminOnly };
