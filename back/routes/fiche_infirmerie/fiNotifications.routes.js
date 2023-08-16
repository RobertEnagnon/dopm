const controller = require("../../controllers/fiches_infirmerie/fiNotification.controller");

module.exports = function (app) {
  app.get("/api/finotifications", controller.getNotifications);
  app.post("/api/finotifications", controller.addOrUpdateNotification);
}