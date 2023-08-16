const controller = require("../../controllers/top5/indicator.controller");
const controllerTarget = require("../../controllers/top5/target.controller");
const controllerCurve = require("../../controllers/top5/curve.controller");
const controllerData = require("../../controllers/top5/data.controller");

const moment = require("moment");

module.exports = function (app) {
  app.get("/api/indicators/", async (req, res) => {
    const { categoryId } = req.query;
    let indicators = [],
      targets = [],
      curves = [],
      data = [];

    try {
      indicators = await controller.getIndicatorsByCategory(
        parseInt(categoryId, 10)
      );
    } catch (error) {
      return res.status(400).json({
        error: "GetIndicatorsByCategory : " + error,
      });
    }

    for (let i = 0; i < indicators.length; i++) {
      try {
        targets = await controllerTarget.getTargetsByIndicator(
          indicators[i].id
        );
      } catch (error) {
        return res.status(400).json({
          error: "getTargetsByIndicator : " + error,
        });
      }

      try {
        curves = await controllerCurve.getCurvesByIndicator(indicators[i].id);
      } catch (error) {
        return res.status(400).json({
          error: "getCurvesByIndicator : " + error,
        });
      }

      let date;
      switch (indicators[i].reading) {
        case 0:
          date = moment().subtract(1, "day").format("DD/MM/YYYY");
          break;
        case 1:
          date = moment().format("DD/MM/YYYY");
          break;
        case 2:
          date = moment().add(1, "day").format("DD/MM/YYYY");
          break;
        default:
          break;
      }

      for (const curve of curves) {
        try {
          curve_data = await controllerData.getDatasByCurve(curve.id, date);
          for (let i = 0; i < curve_data.length; i++) {
            curve_data[i]["curve"] = curve;
          }
          data = data.concat(curve_data);
        } catch (error) {
          return res.status(400).json({
            error: "getDatasByCurve : " + error,
          });
        }
      }

      indicators[i]["targets"] = targets;
      indicators[i]["curves"] = curves;
      indicators[i]["data"] = data;
    }

    res.status(200).json(indicators);
  });
  app.get("/api/indicator/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const indicator = await controller.getOneIndicator(parseInt(id, 10));
      res.status(200).json(indicator);
    } catch (error) {
      res.status(400).json({
        error: "GetOneIndicator : " + error,
      });
    }
  });
  app.post("/api/indicators", controller.createIndicator);
  app.post("/api/indicators/file-upload", controller.uploadIndicatorFile);
  app.post("/api/indicators/file-remove", controller.removedIndicatorFile);
  app.put("/api/indicators/:id", controller.updateIndicator);

  app.delete("/api/indicators/:id", controller.deleteIndicator);
  app.delete(
    "/api/indicators/deleteAll/:id",
    controller.deleteIndicatorByCategory
  );
  app.get("/api/indicators/file/:id", controller.downloadFile);
};
