require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const patientRoutes = require("./routes/patient");
const insurerRoutes = require("./routes/insurer");
const userPreferenceRoutes = require("./routes/userPreferenceRoutes"); // <--- Import New Route

const app = express();
app.use(cors({
  origin: ["https://aarogya-lemon.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use Routes
app.use("/api/patient", patientRoutes);
app.use("/api/insurer", insurerRoutes);
app.use("/api/user", userPreferenceRoutes); // <--- Use New Route

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});