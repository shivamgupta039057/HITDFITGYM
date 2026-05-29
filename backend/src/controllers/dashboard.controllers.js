const Member = require("../models/member.models");

const Payment = require("../models/payment.models");

const getDashboardStats =
async (req, res) => {

  try {

    // Current Month Start
    const startOfMonth =
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    // Current Month End
    const endOfMonth =
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    // Total Members Added This Month
    const totalMembers =
    await Member.countDocuments({

      createdAt: {

        $gte: startOfMonth,

        $lte: endOfMonth,

      },

    });

    // Active Members
    const activeMembers =
    await Member.countDocuments({

      status: "active",

    });

    // Expired Members
    const expiredMembers =
    await Member.countDocuments({

      status: "expired",

    });

    // Left Members
    const leftMembers =
    await Member.countDocuments({

      status: "left",

    });

    // Monthly Revenue
    const monthlyPayments =
    await Payment.find({

      createdAt: {

        $gte: startOfMonth,

        $lte: endOfMonth,

      },

    });

    const monthlyRevenue =
    monthlyPayments.reduce(

      (sum, item) => {

        return sum + item.amount;

      },

      0

    );

    return res.status(200).json({

      status: 200,

      message:
        "Dashboard data fetched successfully",

      data: {

        totalMembers,

        activeMembers,

        expiredMembers,

        leftMembers,

        monthlyRevenue,

      },

    });

  } catch (error) {

    return res.status(500).json({

      status: 500,

      message: error.message,

    });

  }

};

module.exports = {

  getDashboardStats,

};