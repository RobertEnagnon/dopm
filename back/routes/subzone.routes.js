const controller = require("../controllers/subzone.controller");

module.exports = function(app) {
    app.get("/api/subzones/:id", controller.getAllSubZones);
    app.get("/api/subzone/:id", controller.getOneSubZone);
    app.post("/api/subzones", controller.createSubZone);
    app.put("/api/subzones/:id", controller.updateSubZone);
    app.delete("/api/subzones/:id", controller.deleteSubZone);
};
