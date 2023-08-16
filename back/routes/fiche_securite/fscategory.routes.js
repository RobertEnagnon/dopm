const controller = require("../../controllers/fiches_securite/fscategory.controller");

module.exports = function (app) {
  app.get("/api/fscategories", controller.getAllFSCategory);
  app.get("/api/fscategory/:id", controller.getOneFSCategory);
  app.get("/api/fsCategoryByName/:name", controller.getOneFSCategoryByName);
  app.post("/api/fscategories", controller.createFSCategorie);
  app.put("/api/fscategories/:id", controller.updateFSCategory);
  app.delete("/api/fscategories/:id", controller.deleteFSCategory);
};
