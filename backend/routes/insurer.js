const express = require("express");
const Claim = require("../models/claim"); 
const router = express.Router();

// Get unique User IDs
router.get("/unique-users", async (req, res) => {
  try {
    const userIDs = await Claim.distinct("userID");
    res.status(200).json(userIDs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET claims by SPECIFIC User ID
// Note: Route is /claims/user/:userID
router.get("/claims/user/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const userClaims = await Claim.find({ userID });
    res.status(200).json(userClaims);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT route to update a claim
router.put("/claims/:id", async (req, res) => {
    try {
      const { status, approvedAmount, insurerComments } = req.body;
  
      if (!status || !approvedAmount || !insurerComments) {
        return res.status(400).json({ message: "All fields are required for updating the claim." });
      }
  
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