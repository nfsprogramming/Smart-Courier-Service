const { db } = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    if (!db) throw new Error("Firebase is not initialized");
    const { name, email, password, phone, role } = req.body;
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    
    if (!snapshot.empty) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role: role || "customer",
      createdAt: new Date().toISOString()
    };

    const docRef = await usersRef.add(newUser);

    res.status(201).json({
      _id: docRef.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(docRef.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    if (!db) throw new Error("Firebase is not initialized");
    const { email, password } = req.body;
    const snapshot = await db.collection("users").where("email", "==", email).get();
    
    if (snapshot.empty) return res.status(400).json({ message: "Invalid credentials" });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: userDoc.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(userDoc.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
