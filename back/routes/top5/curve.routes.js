const controller = require("../../controllers/top5/curve.controller");

module.exports = function (app) {
    app.get("/api/curve/all", controller.getAllCurve);
    //app.get("/api/curve/:id", controller.getOneCurve);
    app.get("/api/curves/", async (req, res) => {

        const { indicatorId, include } = req.query;
        try {
            const curve = await controller.getCurvesByIndicator(parseInt(indicatorId), include);
            res.status(200).json(curve)
        } catch (error) {
            res.status(400).json({
                error: "getCurvesByIndicator : " + error
            });
        }
    });
    app.post("/api/curves", controller.createCurve);
    app.put("/api/curves/:id", controller.updateCurve);
    app.delete("/api/curves/deleteAll/:id", controller.deleteCurveByIndicator);
    app.delete("/api/curves/:id", controller.deleteCurve);
};
