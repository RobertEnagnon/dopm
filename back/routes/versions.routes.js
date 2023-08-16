const controller = require("../controllers/versions.controller");

module.exports = function(app) {
    app.get("/api/versions", controller.getAllVersions);
    app.get("/api/versions/:id", controller.getOneVersion);
    app.get("/api/versions-last", controller.getLastVersion);
    app.post("/api/versions", controller.createVersion);
    app.put("/api/versions/:id", controller.updateVersion);
    app.delete("/api/versions/:id", controller.deleteVersion);
}