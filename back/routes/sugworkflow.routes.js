const {
  createSugWorkflow,
  updateSugWorkflow,
  getAllSugWorkflows,
} = require("../controllers/sugworkflow.controller");

module.exports = function (app) {
  app.get("/api/sugworkflows", getAllSugWorkflows);
  app.post("/api/sugworkflows", createSugWorkflow);
  app.put("/api/sugworkflows/:id", updateSugWorkflow);
};
