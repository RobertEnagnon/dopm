const controller = require("../controllers/period.controller");

module.exports = function (app) {
  app.post("/api/period-create", controller.createPeriod);
  app.put("/api/period/:id", controller.updatePeriod);
};
