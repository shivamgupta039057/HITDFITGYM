const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
require("./cron/membershipReminder");
app.use((req, res, next) => {
  next();
});
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  next();
});

app.use(cookieParser());
require('./routes')(app);

module.exports = { app }