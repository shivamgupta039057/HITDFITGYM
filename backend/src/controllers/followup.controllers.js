const Followup = require("../models/followup.models");

const createFollowup = async (req, res) => {
  try {

    const followup = await Followup.create(req.body);

    return res.status(201).json({
      status: 201,
      message: "Followup created successfully",
      data: followup,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

const getFollowups = async (req, res) => {
  try {

    const followups = await Followup.find()
      .populate("memberId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      message: "Followups fetched successfully",
      data: followups,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

const editFollowup = async (req, res) => {

  try {

    const {

      followupId,

      memberId,
      note,
      nextCallDate,
      reason ,
      response,
      status,

    } = req.body;

    // Check Followup
    const followup =
    await Followup.findById(
      followupId
    );

    if (!followup) {

      return res.status(404).json({

        status: 404,

        message:
          "sdlkfjsdlkfjdslskjsdlFollowup not found",

      });

    }

    // Update Followup
    const updatedFollowup =
    await Followup.findByIdAndUpdate(

      followupId,

      {

        memberId,
        note,
        nextCallDate,
        reason,
        response,
        status,

      },

      {
        new: true,
      }

    ).populate("memberId");

    return res.status(200).json({

      status: 200,

      message:
        "Followup updated successfully",

      data: updatedFollowup,

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};

const deleteFollowup = async (req, res) => {
  try {

    const { id } = req.body;

    await Followup.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Followup deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

module.exports = {
  createFollowup,
  getFollowups,
  deleteFollowup,
  editFollowup
};