const controller = require("../controllers/rights/rights_user_groupes.controller");

module.exports = function(app) {
  app.post("/api/users/:user/group/:group", controller.addUserToGroup);
  app.delete("/api/users/:user/group/:group", controller.deleteUserFromGroup);
};