const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },

  amount: Number,

  paymentMethod: {
    type: String,
    enum: ["cash", "upi", "card"],
    default: "cash",
  },

  note: String,

  paymentDate: {
    type: Date,
    default: Date.now,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("Payment", paymentSchema);