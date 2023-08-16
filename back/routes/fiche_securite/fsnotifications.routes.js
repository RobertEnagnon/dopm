const controller = require("../../controllers/fiches_securite/fsnotification.controller");

module.exports = function (app) {
  app.get("/api/fsnotifications", controller.getNotifications);
  app.post("/api/fsnotifications", controller.addOrUpdateNotification);
};
