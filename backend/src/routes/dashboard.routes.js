const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/dashboard.controllers.js");

const Router = express.Router();

Router.get(
  "/stats",
  getDashboardStats
);

module.exports = Router;