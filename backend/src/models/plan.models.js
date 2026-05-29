const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({

  planName: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: String,

  status: {
    type: Boolean,
    default: true,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("Plan", planSchema);