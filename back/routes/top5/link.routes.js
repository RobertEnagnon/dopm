const controller = require("../../controllers/top5/link.controller");

module.exports = function(app) {
    app.get("/api/link/all", controller.getAllLink);
    app.get("/api/link/:id", controller.getOneLink);
    app.post("/api/link/create", controller.createLink);
    app.put("/api/link/update/:id", controller.updateLink);
    app.delete("/api/link/delete/:id", controller.deleteLink);
};