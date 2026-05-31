const express = require("express");

const {
  createPayment,
  getPayments,
  deletePayment,
  getPaymentById,
} = require("../controllers/payment.controllers");

const Router = express.Router();

Router.post("/create", createPayment);

Router.get("/get", getPayments);

Router.post("/delete", deletePayment);

Router.get(
  "/:id", getPaymentById
);

module.exports = Router;