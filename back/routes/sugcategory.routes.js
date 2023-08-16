const {
  getAllSugCategories,
  createSugCategory,
  updateSugCategory,
  deleteSugCategory,
} = require("../controllers/sugcategory.controller");

module.exports = function (app) {
  app.get("/api/sugcategories", getAllSugCategories);
  app.post("/api/sugcategories", createSugCategory);
  app.put("/api/sugcategories/:id", updateSugCategory);
  app.delete("/api/sugcategories/:id", deleteSugCategory);
};
