const controller = require("../../controllers/top5/data.controller");

module.exports = function (app) {
    app.get("/api/data/all", controller.getAllData);
    //app.get("/api/data/:id", controller.getOneData);
    app.get("/api/datas/", async (req, res) => {

        const { curveId, date } = req.query;
        if (curveId !== undefined && date === undefined)
            res.status(400).json({ error: "Wrong Id" })

        try {
            const data = await controller.getDatasByCurve(curveId, date);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ error: "GetDatasByCurve : " + error });
        };
    });
    app.post("/api/datas", controller.createData);
    app.put("/api/datas/:id", controller.updateData);
    app.delete("/api/datas/deleteAll/:id", controller.deleteDataByCurve);
    app.delete("/api/datas/:id", controller.deleteData);
};
