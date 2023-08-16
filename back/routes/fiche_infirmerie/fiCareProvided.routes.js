const controller = require("../../controllers/fiches_infirmerie/fiCareProvided.controller");

module.exports = function (app) {
  app.get("/api/fi_careProvided", controller.getAllCategory);
  app.get("/api/fi_careProvided/:id", controller.getOneCategory);
  app.get("/api/fi_careProvided/name/:name", controller.getOneCategoryByName);
  app.post("/api/fi_careProvided", controller.createCategorie);
  app.put("/api/fi_careProvided/:id", controller.updateCategory);
  app.delete("/api/fi_careProvided/:id", controller.deleteCategory);
}