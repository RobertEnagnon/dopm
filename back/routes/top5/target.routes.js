const controller = require("../../controllers/top5/target.controller");

module.exports = function (app) {
    app.get("/api/target/all", controller.getAllTarget);
    //app.get("/api/target/:id", controller.getOneTarget);
    app.get("/api/targets/", async (req, res) => {

        const { indicatorId } = req.query;
        try {
            const target = await controller.getTargetsByIndicator(parseInt(indicatorId, 10));
            res.status(200).json(target)
        }
        catch (error) {
            res.status(400).json({
                error: "GetOneTarget : " + error
            });
        }
    });
    app.post("/api/targets", controller.createTarget);
    app.put("/api/targets/:id", controller.updateTarget);
    app.delete("/api/targets/deleteAll/:id", controller.deleteTargetByIndicator);
    app.delete("/api/targets/:id", controller.deleteTarget);
};
