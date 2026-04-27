const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/student_complaint_system";

app.use(
  cors({
    origin: [
      "https://student-complaint-system-49er.onrender.com",
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/complaints", complaintRoutes);

const projectRoot = path.join(__dirname, "..");
app.use(express.static(projectRoot));

app.get("/", (req, res) => {
  res.redirect("/frontend/login.html");
});

async function ensureDefaultAdmin() {
  const adminUsername = "admin@123";
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.findOneAndUpdate(
    { username: adminUsername },
    {
      username: adminUsername,
      password: hashedPassword,
      role: "admin",
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    await ensureDefaultAdmin();
    console.log("Default admin ensured: admin@123");
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
