const controller = require("../../controllers/fiches_infirmerie/fiClassification.controller");

module.exports = function (app) {
  app.get("/api/fi_classification", controller.getAllCategory);
  app.get("/api/fi_classification/:id", controller.getOneCategory);
  app.get("/api/fi_classification/name/:name", controller.getOneCategoryByName);
  app.post("/api/fi_classification", controller.createCategorie);
  app.put("/api/fi_classification/:id", controller.updateCategory);
  app.delete("/api/fi_classification/:id", controller.deleteCategory);
}