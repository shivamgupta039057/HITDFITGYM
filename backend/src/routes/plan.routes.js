const express = require("express");

const {
  createPlan,
  getPlans,
  deletePlan,
  editPlan
} = require("../controllers/plan.controllers.js");

const Router = express.Router();

Router.post("/create", createPlan);

Router.get("/get", getPlans);

Router.post("/delete", deletePlan);

Router.post(
  "/edit",
  editPlan
);


module.exports = Router;