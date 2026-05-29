const prefix = "/api/v1";

module.exports = (app) => {

  app.use(`${prefix}/members`, require("./members.routes.js"));

  app.use(`${prefix}/attendance`, require("./attendance.routes.js"));

  app.use(`${prefix}/payment`, require("./payment.routes.js"));

  app.use(`${prefix}/plan`, require("./plan.routes"));

  app.use(`${prefix}/followup`, require("./followup.routes.js"));

  app.use(`${prefix}/dashboard`, require("./dashboard.routes.js"));

};