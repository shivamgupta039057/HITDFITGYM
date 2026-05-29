const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },

  date: {
    type: Date,
    default: Date.now,
  },

  checkInTime: String,

}, {
  timestamps: true,
});

module.exports = mongoose.model("Attendance", attendanceSchema);