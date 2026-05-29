const Member = require("../models/member.models");
const Payment = require("../models/payment.models");
const Plan = require("../models/plan.models");

const createMember = async (req, res) => {

  try {

    const {

      fullName,
      phone,
      age,
      gender,
      address,
      planId,
      paidFees,
      weight,
      goal,

    } = req.body;

    // Check Plan
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        status: 404,
        message: "Plan not found",
      });
    }

    // Join Date
    const joinDate = new Date();

    // Expiry Date
    const expiryDate = new Date();

    expiryDate.setMonth(
      expiryDate.getMonth() + plan.duration
    );

    const totalFees = plan.price;

    const pendingFees =
      Number(totalFees) - Number(paidFees);

    // Create Member
    const member = await Member.create({

      fullName,
      phone,
      age,
      gender,
      address,

      planId,

      joinDate,
      expiryDate,

      totalFees,
      paidFees,
      pendingFees,

      weight,
      goal,

    });

    return res.status(201).json({
      status: 201,
      message: "Member created successfully",
      data: member,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};




const getMembers = async (req, res) => {

  try {

    const {
      search = "",
      page = 1,
      perPage = 10,

      status,
      planId,
      pendingFees,
      expiringSoon,

    } = req.query;

    // Today's Date
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // Auto Update Expired Status
    await Member.updateMany(

      {
        expiryDate: {
          $lt: today,
        },
      },

      {
        $set: {
          status: "expired",
        },
      }

    );

    // Main Query
    let query = {};

    // Search
    if (search) {

      query.$or = [

        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },

        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },

      ];

    }

    // Status Filter
    if (status) {
      query.status = status;
    }

    // Plan Filter
    if (planId) {
      query.planId = planId;
    }

    // Pending Fees Filter
    if (pendingFees === "true") {

      query.pendingFees = {
        $gt: 0,
      };

    }

    // Expiring Soon Filter
    if (expiringSoon === "true") {

      const next3Days = new Date();

      next3Days.setDate(
        today.getDate() + 3
      );

      query.expiryDate = {
        $gte: today,
        $lte: next3Days,
      };

    }

    // Total Count
    const totalItems =
      await Member.countDocuments(query);

    // Members
    const members = await Member.find(query)

      .populate("planId")

      .sort({ createdAt: -1 })

      .skip((page - 1) * perPage)

      .limit(Number(perPage));

    return res.status(200).json({

      status: 200,

      message: "Members fetched successfully",

      data: members,

      pagination: {

        totalItems,

        currentPage: Number(page),

        totalPages: Math.ceil(
          totalItems / perPage
        ),

      },

    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};



const getExpiredMembers = async (req, res) => {

  try {

    const today = new Date();

    today.setHours(0,0,0,0);

    const members = await Member.find({

      expiryDate: {
        $lt: today,
      },

    }).populate("planId");

    return res.status(200).json({
      status: 200,
      data: members,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};

const getExpiringMembers = async (req, res) => {

  try {

    const today = new Date();

    const next3Days = new Date();

    next3Days.setDate(today.getDate() + 3);

    const members = await Member.find({

      expiryDate: {
        $gte: today,
        $lte: next3Days,
      },

    }).populate("planId");

    return res.status(200).json({
      status: 200,
      data: members,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};

const renewMembership = async (req, res) => {

  try {

    const {
      memberId,
      paidAmount,
      paymentMethod,
    } = req.body;

    // Find Member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        status: 404,
        message: "Member not found",
      });
    }

    // Find Plan
    const plan = await Plan.findById(member.planId);

    if (!plan) {
      return res.status(404).json({
        status: 404,
        message: "Plan not found",
      });
    }

    // Current Date
    const today = new Date();

    // New Expiry Date
    const expiryDate = new Date(today);

    expiryDate.setMonth(
      expiryDate.getMonth() + plan.duration
    );

    // Save Payment History
    await Payment.create({

      memberId: member._id,

      amount: paidAmount,

      paymentMethod,

      note: "Membership Renewed",

    });

    // Update Member
    member.joinDate = today;

    member.expiryDate = expiryDate;

    member.paidFees += Number(paidAmount);

    member.pendingFees =
      plan.price - member.paidFees;

    member.status = "active";

    await member.save();

    return res.status(200).json({
      status: 200,
      message: "Membership renewed successfully",
      data: member,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }

};

const getMemberPaymentHistory =
  async (req, res) => {

  try {

    const { memberId } = req.params;

    const payments = await Payment.find({

      memberId,

    })

    .populate("memberId")

    .sort({ paymentDate: -1 });

    // Total Paid
    const totalPaid = payments.reduce(

      (sum, item) => sum + item.amount,

      0

    );

    return res.status(200).json({

      status: 200,

      totalPayments: payments.length,

      totalPaidAmount: totalPaid,

      data: payments,

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};


const changeMemberStatus =
async (req, res) => {

  try {

    const {
      memberId,
      status,
    } = req.body;

    const validStatus = [

      "active",
      "expired",
      "left",

    ];

    if (
      !validStatus.includes(status)
    ) {

      return res.status(400).json({

        status: 400,

        message: "Invalid status",

      });

    }

    const member =
    await Member.findByIdAndUpdate(

      memberId,

      {
        status,
      },

      {
        new: true,
      }

    );

    return res.status(200).json({

      status: 200,

      message:
        "Member status updated",

      data: member,

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};


const editMember = async (req, res) => {

  try {

    const {

      memberId,

      fullName,
      phone,
      age,
      gender,
      address,
      planId,
      weight,
      goal,

    } = req.body;

    // Check Member
    const member =
    await Member.findById(memberId);

    if (!member) {

      return res.status(404).json({

        status: 404,

        message: "Member not found",

      });

    }

    // Update Member
    const updatedMember =
    await Member.findByIdAndUpdate(

      memberId,

      {

        fullName,
        phone,
        age,
        gender,
        address,
        planId,
        weight,
        goal,

      },

      {
        new: true,
      }

    ).populate("planId");

    return res.status(200).json({

      status: 200,

      message:
        "Member updated successfully",

      data: updatedMember,

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};


const deleteMember = async (req, res) => {
  try {

    const { id } = req.body;

    await Member.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Member deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

module.exports = {
  createMember,
  getMembers,
  deleteMember,
  getExpiringMembers,
  getExpiredMembers,
  renewMembership,
  getMemberPaymentHistory,
  changeMemberStatus,
  editMember
};