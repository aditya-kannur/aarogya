const mongoose = require("mongoose");

const insurerDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "Insurer" }
});

module.exports = mongoose.model("InsurerDetails", insurerDetailsSchema);