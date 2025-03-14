require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patient"); 
const insurerRoutes = require("./routes/insurer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use(express.json());


// Connection to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use routes
app.use("/api/patient", patientRoutes);
app.use("/api/insurer", insurerRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
