const controller = require("../../controllers/top5/setting.controller");

module.exports = function(app) {
    app.post("/api/setting/altdate", controller.altDate)
};