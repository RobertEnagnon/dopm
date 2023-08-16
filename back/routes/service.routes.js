const controller = require("../controllers/service.controller");

module.exports = function(app) {
    app.get("/api/services", controller.getAllServices);
    app.get("/api/service/:id", controller.getOneService);
    app.get("/api/serviceByName/:name", controller.getOneServiceByName);
    app.post("/api/services", controller.createService);
    app.put("/api/services/:id", controller.updateService);
    app.delete("/api/services/:id", controller.deleteService);

};