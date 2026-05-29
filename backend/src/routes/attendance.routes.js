const express = require("express");

const {
  createAttendance,
  getAttendance,
  deleteAttendance,
  editAttendance
} = require("../controllers/attendance.controllers");

const Router = express.Router();

Router.post("/create", createAttendance);

Router.get("/get", getAttendance);

Router.post("/delete", deleteAttendance);

Router.post(
  "/edit",
  editAttendance
);

module.exports = Router;