const controller = require("../controllers/rights/rights_permissions.controller");

module.exports = function(app) {
    app.get("/api/rights_permissions", controller.getAllRightsPermissions);
    app.get("/api/rights_permissions/:id", controller.getOneRightsPermission);
    app.get("/api/rights_permissions/:name", controller.getOneRightsPermissionByName);
    app.post("/api/rights_permissions", controller.createRightsPermission);
    app.put("/api/rights_permissions/:id", controller.updateRightsPermission);
    app.delete("/api/rights_permissions/:id", controller.deleteRightsPermission);
};