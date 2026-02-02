const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  lastRole: { type: String, default: "" } // Stores "Patient" or "Insurer"
});

module.exports = mongoose.model("UserPreference", userPreferenceSchema);