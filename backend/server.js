// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const patientRoutes = require("./routes/patient"); 
// const insurerRoutes = require("./routes/insurer");

// const app = express();

// // CORS Middleware 
// // app.use(
// //   cors({
// //     origin: "https://aarogya-lemon.vercel.app",  // Allow frontend requests
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     credentials: true,
// //   }),
// //   cors({
// //     origin: "http://localhost:5173",  // Allow frontend requests
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     credentials: true,
// //   })
// // );

// app.use(cors());

// // Middleware
// app.use(express.json()); // Parse JSON
// app.use("/uploads", express.static("uploads")); 

// //  MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// // Use Routes
// app.use("/api/patient", patientRoutes);
// app.use("/api/insurer", insurerRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patient"); 
const insurerRoutes = require("./routes/insurer");

const app = express();

app.use(cors());
app.use(express.json()); 
app.use("/uploads", express.static("uploads")); 

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- 1. DEFINE SCHEMA DIRECTLY HERE (No new file) ---
const userPreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  lastRole: { type: String, default: "" } 
});
const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);

// --- 2. ADD ROUTES FOR ROLE HANDLING ---

// Get saved role
app.get("/api/user/role/:email", async (req, res) => {
  try {
    const pref = await UserPreference.findOne({ email: req.params.email });
    res.json({ lastRole: pref ? pref.lastRole : "" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
});

// Save role
app.post("/api/user/role", async (req, res) => {
  const { email, role } = req.body;
  try {
    await UserPreference.findOneAndUpdate(
      { email }, 
      { lastRole: role }, 
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save role" });
  }
});

// Use Existing Routes
app.use("/api/patient", patientRoutes);
app.use("/api/insurer", insurerRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});