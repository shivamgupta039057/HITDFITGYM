const Attendance = require("../models/attendance.models");

const createAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.create(req.body);

    return res.status(201).json({
      status: 201,
      message: "Attendance marked successfully",
      data: attendance,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

const getAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find()
      .populate("memberId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      message: "Attendance fetched successfully",
      data: attendance,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

const editAttendance = async (req, res) => {

  try {

    const {

      attendanceId,

      memberId,
      date,
      status,

    } = req.body;

    // Check Attendance
    const attendance =
    await Attendance.findById(
      attendanceId
    );

    if (!attendance) {

      return res.status(404).json({

        status: 404,

        message:
          "Attendance not found",

      });

    }

    // Update Attendance
    const updatedAttendance =
    await Attendance.findByIdAndUpdate(

      attendanceId,

      {

        memberId,
        date,
        status,

      },

      {
        new: true,
      }

    ).populate("memberId");

    return res.status(200).json({

      status: 200,

      message:
        "Attendance updated successfully",

      data: updatedAttendance,

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};


const deleteAttendance = async (req, res) => {
  try {

    const { id } = req.body;

    await Attendance.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Attendance deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

module.exports = {
  createAttendance,
  getAttendance,
  deleteAttendance,
  editAttendance
};