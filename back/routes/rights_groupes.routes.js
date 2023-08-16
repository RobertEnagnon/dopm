const controller = require("../controllers/rights/rights_groupes.controller");

module.exports = function(app) {
    app.get("/api/rights_groupes", controller.getAllRightsGroupes);
    app.get("/api/rights_groupes/:id", controller.getOneRightsGroupe);
    app.post("/api/rights_groupes", controller.createRightsGroupe);
    app.put("/api/rights_groupes/:id", controller.updateRightsGroupe);
    app.delete("/api/rights_groupes/:id", controller.deleteRightsGroupe);
};