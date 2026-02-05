const express = require("express");
const Claim = require("../models/claim");
const router = express.Router();
const InsurerDetails = require("../models/InsurerDetails");

// Get unique User IDs
router.get("/unique-users", async (req, res) => {
  try {
    const users = await Claim.aggregate([
      {
        $group: {
          _id: "$userID",
          name: { $first: "$name" },
          email: { $first: "$email" },
          totalClaims: { $sum: 1 }
        }
      },
      {
        $project: {
          userID: "$_id",
          name: 1,
          email: 1,
          totalClaims: 1,
          _id: 0
        }
      }
    ]);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET claims by SPECIFIC User ID
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
    const { name, email, amount, description, status, approvedAmount, insurerComments } = req.body;

    // Use a flexible update object
    const updateData = {
      name, email, amount, description, status, approvedAmount, insurerComments
    };

    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// Request authorization (with authId check)
router.post("/request-authorization", async (req, res) => {
  const { email, name, role, authId } = req.body;
  if (!email || !name || !authId) {
    return res.status(400).json({ message: "All fields required." });
  }
  if (authId !== process.env.INSURER_AUTH_ID) {
    return res.status(401).json({ message: "Invalid Authorization ID." });
  }
  const exists = await InsurerDetails.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Already authorized." });
  }
  const newInsurer = new InsurerDetails({ email, name, role });
  await newInsurer.save();
  res.status(201).json({ message: "Authorized." });
});

// Check if user is authorized
router.post("/check-authorization", async (req, res) => {
  const { email } = req.body;
  const exists = await InsurerDetails.findOne({ email });
  res.json({ authorized: !!exists });
});


module.exports = router;