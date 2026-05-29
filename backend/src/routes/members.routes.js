const express = require("express");

const {
  createMember,
  getMembers,
  deleteMember,
  getExpiredMembers,
  getExpiringMembers,
  renewMembership,
  getMemberPaymentHistory,
  changeMemberStatus,
  editMember
} = require("../controllers/members.controllers.js");

const Router = express.Router();

Router.post("/create", createMember);

Router.get("/get", getMembers);

Router.post("/delete", deleteMember);

Router.post(
  "/change-status",
  changeMemberStatus
);


Router.post(
  "/renew-membership",
  renewMembership
);

Router.post(
  "/edit",
  editMember
);

Router.get(
  "/member-payment-history/:memberId",
  getMemberPaymentHistory
);

Router.get("/expired-members", getExpiredMembers);

Router.get("/expiring-members", getExpiringMembers);

module.exports = Router;