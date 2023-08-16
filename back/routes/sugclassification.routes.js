const {
  getAllSugClassifications,
  createSugClassification,
  updateSugClassification,
  deleteSugClassification,
} = require("../controllers/sugclassification.controller");

module.exports = function (app) {
  app.get("/api/sugclassifications", getAllSugClassifications);
  app.post("/api/sugclassifications", createSugClassification);
  app.put("/api/sugclassifications/:id", updateSugClassification);
  app.delete("/api/sugclassifications/:id", deleteSugClassification);
};
