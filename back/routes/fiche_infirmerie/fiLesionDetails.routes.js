const controller = require("../../controllers/fiches_infirmerie/fiLesionDetails.controller");

module.exports = function (app) {
  app.get("/api/fi_lesionDetails", controller.getAllCategory);
  app.get("/api/fi_lesionDetails/:id", controller.getOneCategory);
  app.get("/api/fi_lesionDetails/name/:name", controller.getOneCategoryByName);
  app.post("/api/fi_lesionDetails", controller.createCategorie);
  app.put("/api/fi_lesionDetails/:id", controller.updateCategory);
  app.delete("/api/fi_lesionDetails/:id", controller.deleteCategory);
}