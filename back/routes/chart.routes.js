const moment = require("moment");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const controllerTarget = require("../controllers/top5/target.controller");
const controllerCurve = require("../controllers/top5/curve.controller");
const controllerData = require("../controllers/top5/data.controller");
const controllerHistorical = require("../controllers/top5/historical.controller");

module.exports = function (app) {
  app.get("/api/chart/", async (req, res, next) => {
    const { indicatorId, include, date } = req.query;
    let { range } = req.query;
    let historical = [],
      targets = [],
      data = [],
      curves = [];

    // Création d'une liste contenant les mois des données à retourner
    let dates = [];
    let monthCounter = 0;
    while (range && range > 0) {
      dates.push(
        moment(date, "D/M/YYYY")
          .subtract(monthCounter, "months")
          .format("MM/YYYY")
      );
      range -= 4;
      monthCounter++;
    }

    try {
      historical = await controllerHistorical.getHistoricalsByIndicator(
        parseInt(indicatorId, 10)
      );
    } catch (error) {
      return res.status(400).json({
        error: "getHistoricalsByIndicator : " + error,
      });
    }

    try {
      targets = await controllerTarget.getTargetsByIndicator(
        parseInt(indicatorId, 10)
      );
    } catch (error) {
      return res.status(400).json({
        error: "getTargetsByIndicator : " + error,
      });
    }

    try {
      curves = await controllerCurve.getCurvesByIndicator(
        parseInt(indicatorId),
        include
      );
    } catch (error) {
      return res.status(400).json({
        error: "getCurvesByIndicator : " + error,
      });
    }

    for (const curve of curves) {
      try {
        // Récupérer les données sur les mois précédents
        if (dates.length) {
          for (d of dates)
            data = data.concat(
              await controllerData.getDatasByCurve(curve.id, d)
            );
        } else
          data = data.concat(
            await controllerData.getDatasByCurve(curve.id, date)
          );

        for (let i = 0; i < data.length; i++)
          if (!("curve" in data[i])) data[i]["curve"] = curve;
      } catch (error) {
        return res.status(400).json({
          error: "getDatasByCurve : " + error,
        });
      }
    }

    res.status(200).json({
      historical,
      targets,
      curves,
      data,
    });
  });

  app.get("/api/module-chart/", async (req, res, next) => {
    const { indicatorId, moduleId, moduleZoneId, date } = req.query;

    let datas = [];
    let historical = [];
    let targets = [];

    let formatted_date = `${date.substring(3)}-${date.substring(0, 2)}-01`;
    let start_date = moment(formatted_date).startOf("month").toDate();
    let end_date = moment(formatted_date).endOf("month").toDate();

    let current_day = "1".padStart(2, "0");
    let end_day = moment(end_date).get("date");

    try {
      targets = await controllerTarget.getTargetsByIndicator(
        parseInt(indicatorId, 10)
      );
    } catch (error) {
      return res.status(400).json({
        error: "getTargetByIndicator : " + error,
      });
    }

    switch (moduleId) {
      /*Fiche Sécu*/
      case "0":
        let where = {
          createdAt: {
            gte: start_date,
            lte: end_date,
          },
        };

        if (/^\d+$/.test(moduleZoneId)) {
          where.moduleZoneId = parseInt(moduleZoneId);
        }
        const fsecurities = await prisma.fs_fichesecurites.findMany({
          where: where,
          orderBy: [{ createdAt: "desc" }],
        });

        do {
          let filtered = fsecurities.filter((fs) => {
            return moment(fs.createdAt).get("date") == parseInt(current_day);
          });
          datas.push(filtered.length);

          current_day = (parseInt(current_day) + 1).toString().padStart(2, "0");
        } while (parseInt(current_day) <= end_day);

        for (let i = 0; i < 12; i++) {
          let start_histo;
          let end_histo;
          if (i !== 0) {
            start_histo = moment()
              .subtract(1, "year")
              .add(i, "month")
              .startOf("month");
            end_histo = moment()
              .subtract(1, "year")
              .add(i, "month")
              .endOf("month");
          } else {
            start_histo = moment().subtract(1, "year").startOf("month");
            end_histo = moment().subtract(1, "year").endOf("month");
          }

          let where = {
            createdAt: {
              gte: start_histo.toDate(),
              lte: end_histo.toDate(),
            },
          };
          if (/^\d+$/.test(moduleZoneId)) {
            where.moduleZoneId = parseInt(moduleZoneId);
          }
          const fsecurities = await prisma.fs_fichesecurites.findMany({
            where: where,
            orderBy: [{ createdAt: "desc" }],
          });
          historical.push(fsecurities.length);
        }
        break;
      default:
        break;
    }

    res.status(200).json({
      historical,
      targets,
      datas,
    });
  });
};
