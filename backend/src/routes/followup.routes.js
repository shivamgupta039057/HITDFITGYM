const express = require("express");

const {
  createFollowup,
  getFollowups,
  deleteFollowup,
  editFollowup
} = require("../controllers/followup.controllers");

const Router = express.Router();

Router.post("/create", createFollowup);

Router.get("/get", getFollowups);

Router.post("/delete", deleteFollowup);

Router.post(
  "/edit",
  editFollowup
);

module.exports = Router;