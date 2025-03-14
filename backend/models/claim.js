const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    userID: String,
    role: String,
    name: String,
    email: String,
    amount: Number,
    description: String,
    status: { type: String, default: "Pending" },
    submissionDate: { type: Date, default: Date.now },
    approvedAmount: Number,
    insurerComments: String,
    documentPath: { type: String }  // Stores the file path of the uploaded document
});

module.exports = mongoose.model("Claim", claimSchema);
