const controller = require("../../controllers/top5/category.controller");
const controllerTarget = require("../../controllers/top5/target.controller");
const controllerCurve = require("../../controllers/top5/curve.controller");

module.exports = function (app) {
    app.get("/api/categories/:id", async (req, res) => {
        const { id } = req.params;

        let categories = [], targets = [], curves = [];
        try {
            categories = await controller.getAllCategory(parseInt(id, 10));
        } catch (error) {
            return res.status(400).json({
                error: "getAllCategory : " + error
            });
        }

        for (let indexCateg = 0; indexCateg < categories.length; indexCateg++) {
            for (let indexInd = 0; indexInd < categories[indexCateg].indicator.length; indexInd++) {
                const indicatorId = categories[indexCateg].indicator[indexInd].id;
                try {
                    targets = await controllerTarget.getTargetsByIndicator(parseInt(indicatorId, 10));
                } catch (error) {
                    return res.status(400).json({
                        error: "getTargetsByIndicator : " + error
                    });
                }

                try {
                    curves = await controllerCurve.getCurvesByIndicator(parseInt(indicatorId), false);
                } catch (error) {
                    return res.status(400).json({
                        error: "getCurvesByIndicator : " + error
                    });
                }

                categories[indexCateg].indicator[indexInd].targets = targets;
                categories[indexCateg].indicator[indexInd].curves = curves;

            }
        }

        res.status(200).json(categories);
    }); //modif 08/08
    app.get("/api/categories", controller.exportAllCategory)
    app.get("/api/category/:id", controller.getOneCategory);
    app.post("/api/categories", controller.createCategory);
    app.put("/api/categories/:id", controller.updateCategory);
    app.delete("/api/categories/:id", controller.deleteCategory);
};
