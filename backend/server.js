require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patient"); 
const insurerRoutes = require("./routes/insurer");

const app = express();

// CORS Middleware 
app.use(
  cors({
    origin: "https://aarogya-lemon.vercel.app", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Middleware
app.use(express.json()); // Parse JSON
app.use("/uploads", express.static("uploads")); 

//  MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use Routes
app.use("/api/patient", patientRoutes);
app.use("/api/insurer", insurerRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
