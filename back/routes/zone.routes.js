const controller = require("../controllers/zone.controller");

module.exports = function(app) {
    app.get("/api/zones", controller.getAllZones);
    app.get("/api/zone/:id", controller.getOneZone);
    app.get("/api/zoneByName/:name", controller.getOneZoneByName);
    app.post("/api/zones", controller.createZone);
    app.put("/api/zones/:id", controller.updateZone);
    app.delete("/api/zones/:id", controller.deleteZone);

};