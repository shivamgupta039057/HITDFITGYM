const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  age: Number,

  gender: {
    type: String,
    enum: ["male", "female"],
  },

  address: String,

  joinDate: {
    type: Date,
    default: Date.now,
  },

  expiryDate: Date,

  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },

  paidFees: {
    type: Number,
    default: 0,
  },

  pendingFees: {
    type: Number,
    default: 0,
  },

  weight: Number,

  goal: String,

  status: {
    type: String,
    enum: ["active", "expired", "left"],
    default: "active",
  },

  lastVisit: Date,

}, {
  timestamps: true,
});

module.exports = mongoose.model("Member", memberSchema);