const {
  getAllSuggestions,
  createSuggestion,
  uploadSuggestionImage,
  removeSuggestionImage,
  updateSuggestion,
  getSuggestion,
  addComityUser,
  editComityUser,
} = require("../controllers/suggestion.controller");

module.exports = function (app) {
  app.get("/api/suggestions", getAllSuggestions);
  app.get("/api/suggestion/:id", getSuggestion);
  app.post("/api/suggestions", createSuggestion);
  app.put("/api/suggestions/:id", updateSuggestion);
  app.post("/api/suggestions/image-upload", uploadSuggestionImage);
  app.post("/api/suggestions/image-remove", removeSuggestionImage);
  app.post("/api/suggestions/comity-user/add", addComityUser);
  app.put("/api/suggestions/comity-user/edit", editComityUser);
};
