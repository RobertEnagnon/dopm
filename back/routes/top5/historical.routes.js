const controller = require("../../controllers/top5/historical.controller");
const controllerIndicator = require("../../controllers/top5/indicator.controller");

module.exports = function (app) {
    app.get("/api/historical/all", controller.getAllHistorical);
    app.get("/api/historical/:id", async (req, res) => {
        try {
            const historical = await controller.getOneHistorical(parseInt(req.params.id, 10))
            res.status(200).json(historical)
        } catch (error) {
            res.status(400).json({
                error: "GetOneHistorical : " + error
            });
        }
    });
    app.get("/api/historicals/", async (req, res) => {
        const { indicatorId, year } = req.query;

        try {
            const historical = await controller.getHistoricalsByIndicator(parseInt(indicatorId, 10), year);
            res.status(200).json(historical)
        } catch (error) {
            res.status(400).json({
                error: "getHistoricalsByIndicator : " + error
            });
        }
    });
    app.get("/api/historicals/calculHistorical", async (req, res) => {
        try {
            const indicatorsCalculHistorical = await controller.getAllIndicatorsCalculHistorical();
            res.status(200).json(indicatorsCalculHistorical);
        } catch (error) {
            res.status(400).json({
                error: "GetAllIndicatorsCalculHistorical : " + error,
            });
        }
    })
    app.post("/api/historicals", async (req, res, next) => {
        try {
            const historical = await controller.createHistorical(req.body, next)
            res.status(201).json({
                message: 'Post saved successfully!',
                historical: historical
            });
        } catch (error) {
            res.status(400).json({
                error: "CreateHistorical : " + error
            });
        }
    });
    app.put("/api/historicals/:id", async (req, res, next) => {
        try {
            const historical = await controller.updateHistorical(req.body, next)
            res.status(201).json({
                message: 'Post updated successfully!',
                historical: historical
            });
        } catch (error) {
            res.status(400).json({
                error: "UpdateHistorical : " + error
            });
        }
    });

    app.put("/api/historicals/calculHistorical/:id", async (req, res, next) => {
        const { id } = req.params;
        const { date } = req.body;

        const selectedDate = new Date(date);
        const indicatorId = parseInt(id, 10);
        const indicator = await controllerIndicator.getOneIndicator(indicatorId);
        if (indicator.indicatorCalculHisto != 1) { // Pas de calcul si historique automatique = Aucun
            let data;
            switch (indicator.indicatorCalculHisto) {
                case 2:
                    data = await controller.computeLastHistorical(indicatorId, selectedDate);
                    break;
                case 3:
                    data = await controller.computeAverageHistorical(indicatorId, selectedDate);
                    break;
                case 4:
                    data = await controller.computeSumHistorical(indicatorId, selectedDate);
                    break;
                default: data = null;
            }

            if (data == null)
                return res.status(400).json({ message: `Type de calcul d'historique inconnu` })

            let historical = await controller.getHistoricalsByIndicator(indicatorId, selectedDate.getFullYear().toString());
            historical = historical.find((data) => data.month == (selectedDate.getMonth() + 1));
            if (historical) {
                controller.updateHistorical({
                    month: historical.month,
                    year: historical.year,
                    data: '' + data,
                    target: historical.target,
                    id: historical.id
                }, next)
            } else {
                controller.createHistorical({
                    month: (selectedDate.getMonth() + 1) <= 9 ? '0' + (selectedDate.getMonth() + 1) : (selectedDate.getMonth() + 1).toString(),
                    year: selectedDate.getFullYear().toString(),
                    data: '' + data,
                    target: null,
                    indicatorId: indicatorId
                }, next)
            }
            res.status(200).json({ message: "Calcul automatique de l'historique effectué" })
        }
        else {
            res.status(400).json({ message: `L'indicateur ${id} n'accepte pas le calcul automatique de l'historique` })
        }

    });
    app.post("/api/historicals/comment/:id", controller.commentHistorical);
    app.delete("/api/historicals/deleteAll/:id", controller.deleteHistoricalByIndicator);
    app.delete("/api/historicals/:id", controller.deleteHistorical);
};
