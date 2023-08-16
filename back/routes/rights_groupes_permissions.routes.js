const controller = require("../controllers/rights/rights_groupes_permissions.controller");

module.exports = function(app) {
    app.post("/api/rights_groupes_permissions", controller.createRightsGroupePermission);
    app.delete("/api/rights_groupes_permissions", controller.deleteRightsGroupePermission);
};