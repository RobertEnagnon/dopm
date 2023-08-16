const controller = require("../../controllers/top5/branch.controller");

module.exports = function (app) {
    app.get("/api/branches", controller.getAllBranch);
    app.get("/api/branch/:id", controller.getOneBranch);
    app.get("/api/branchbyname/:name", controller.getOneBranchByName);
    app.post("/api/branches", controller.createBranch);
    app.put("/api/branches/:id", controller.updateBranch);
    app.delete("/api/branches/:id", controller.deleteBranch);
};