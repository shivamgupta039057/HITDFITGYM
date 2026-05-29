const express = require("express");

const {
  createPayment,
  getPayments,
  deletePayment,
} = require("../controllers/payment.controllers");

const Router = express.Router();

Router.post("/create", createPayment);

Router.get("/get", getPayments);

Router.post("/delete", deletePayment);

module.exports = Router;