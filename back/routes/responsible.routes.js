const controller = require("../controllers/responsible.controller");

module.exports = function(app) {
    app.get("/api/responsibles", controller.getAllResponsibles);
    app.get("/api/responsible/:id", controller.getOneResponsible);
    app.get("/api/responsibleByEmail/:name", controller.getOneResponsibleByEmail);
    // app.post("/api/responsibles", controller.createResponsible);
    // app.put("/api/responsibles/:id", controller.updateResponsible);
    // app.delete("/api/responsibles/:id", controller.deleteResponsible);

};