const controller = require("../controllers/rights/rights_user_permissions.controller");

module.exports = function(app) {
  app.post("/api/users/:user/permission/:permission", controller.addPermissionToUser);
  app.post("/api/users/check_permission/:permission", controller.checkUserPermission);
  app.delete("/api/users/:user/permission/:upId", controller.deletePermissionFromUser);
};