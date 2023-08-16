const controller = require("../../controllers/fiches_securite/classification.controller");

module.exports = function (app) {
  app.get("/api/classifications", controller.getAllClassifications);
  app.get("/api/classification/:id", controller.getOneClassification);
  app.get("/api/classifications/:name", controller.getOneClassificationByName);
  app.post("/api/classifications", controller.createClassification);
  app.put("/api/classifications/:id", controller.updateClassification);
  app.delete("/api/classifications/:id", controller.deleteClassification);
};
