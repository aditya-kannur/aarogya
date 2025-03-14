const express = require("express");
const multer = require("multer");
const Claim = require("../models/claim"); 
const router = express.Router();

// Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage: storage });

// POST route to submit a claim
router.post("/submit", upload.single("document"), async (req, res) => {
  try {
    const { userID, role, name, email, amount, description } = req.body;
    const documentPath = req.file ? req.file.path : null; 

    // Validate required fields
    if (!userID || !role || !name || !email || !amount || !description || !documentPath) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // New claim
    const newClaim = new Claim({
      userID,
      role,
      name,
      email,
      amount,
      description,
      documentPath,
      status: "Pending",
      submissionDate: new Date(),
      approvedAmount: amount,
      insurerComments: "None",
    });

    await newClaim.save();
    res.status(201).json({ message: "Claim submitted successfully!", claim: newClaim });
  } catch (error) {
    console.error("Error submitting claim:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch patient-specific claims
router.get("/claims/:userID", async (req, res) => {
    try {
      const { userID } = req.params;
  
      // Validate userID
      if (!userID) {
        return res.status(400).json({ message: "User ID is required!" });
      }
  
      // Fetch claims that belong to the specific patient
      const userClaims = await Claim.find({ userID });
  
      res.status(200).json(userClaims);
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
