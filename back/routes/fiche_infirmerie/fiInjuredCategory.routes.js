const controller = require("../../controllers/fiches_infirmerie/fiInjuredCategory.controller");

module.exports = function (app) {
  app.get("/api/fi_injcategories", controller.getAllFiInjCategory);
  app.get("/api/fi_injcategories/:id", controller.getOneFiInjCategory);
  app.get("/api/fi_injcategories/name/:name", controller.getOneFiInjCategoryByName);
  app.post("/api/fi_injcategories", controller.createFiInjCategorie);
  app.put("/api/fi_injcategories/:id", controller.updateFiInjCategory);
  app.delete("/api/fi_injcategories/:id", controller.deleteFiInjCategory);
};