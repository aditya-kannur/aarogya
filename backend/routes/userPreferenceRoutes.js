const express = require("express");
const router = express.Router();
const UserPreference = require("../models/UserPreference");

// Fetch saved role for a user
router.get("/role/:email", async (req, res) => {
  try {
    const pref = await UserPreference.findOne({ email: req.params.email });
    res.json({ lastRole: pref ? pref.lastRole : "" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
});

//save or Update role
router.post("/role", async (req, res) => {
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

module.exports = router;