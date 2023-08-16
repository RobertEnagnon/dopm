const controller = require("../../controllers/fiches_infirmerie/fiMaterialElements.controller");

module.exports = function (app) {
  app.get("/api/fi_materialElements", controller.getAllCategory);
  app.get("/api/fi_materialElements/:id", controller.getOneCategory);
  app.get("/api/fi_materialElements/name/:name", controller.getOneCategoryByName);
  app.post("/api/fi_materialElements", controller.createCategorie);
  app.put("/api/fi_materialElements/:id", controller.updateCategory);
  app.delete("/api/fi_materialElements/:id", controller.deleteCategory);
}