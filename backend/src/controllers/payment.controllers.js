const Payment = require("../models/payment.models");

const createPayment = async (req, res) => {
  try {

    const payment = await Payment.create(req.body);

    return res.status(201).json({
      status: 201,
      message: "Payment added successfully",
      data: payment,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

const getPayments = async (req, res) => {
  try {

    const payments = await Payment.find()
      .populate("memberId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      message: "Payments fetched successfully",
      data: payments,
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

const deletePayment = async (req, res) => {
  try {

    const { id } = req.body;

    await Payment.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Payment deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
    });

  }
};

module.exports = {
  createPayment,
  getPayments,
  deletePayment,
};