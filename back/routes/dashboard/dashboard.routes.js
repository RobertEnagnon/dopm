const controller = require("../../controllers/dashboard/dashboard.controller");

module.exports = function(app) {
    app.get("/api/dashboards", controller.getAllDashboards);
    app.get("/api/dashboards/:id", controller.getOneDashboard);
    app.post("/api/dashboards", controller.createDashboard);
    app.put("/api/dashboards/:id", controller.updateDashboard);
    app.delete("/api/dashboards/:id", controller.deleteDashboard);
};