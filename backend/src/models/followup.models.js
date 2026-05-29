const mongoose = require("mongoose");

const followupSchema = new mongoose.Schema({

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },

  reason: String,

  response: String,

  nextCallDate: Date,

}, {
  timestamps: true,
});

module.exports = mongoose.model("Followup", followupSchema);