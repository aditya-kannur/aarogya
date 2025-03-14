const express = require("express");
const Claim = require("../models/claim"); 
const router = express.Router();

// GET route to fetch all claims 
router.get("/claims", async (req, res) => {
  try {
    const claims = await Claim.find(); 
    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT route to update a claim
router.put("/claims/:id", async (req, res) => {
    try {
      const { status, approvedAmount, insurerComments } = req.body;
  
      // Validate required fields
      if (!status || !approvedAmount || !insurerComments) {
        return res.status(400).json({ message: "All fields are required for updating the claim." });
      }
  
      // Find and update the claim by ID
      const updatedClaim = await Claim.findByIdAndUpdate(
        req.params.id,
        { status, approvedAmount, insurerComments },
        { new: true } 
      );
  
      if (!updatedClaim) {
        return res.status(404).json({ message: "Claim not found." });
      }
  
      res.status(200).json({ message: "Claim updated successfully!", claim: updatedClaim });
    } catch (error) {
      console.error("Error updating claim:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  
module.exports = router;
