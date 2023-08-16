const controller = require("../../controllers/dashboard/board.controller");
const controllerIndicator = require("../../controllers/top5/indicator.controller");
const controllerHistorical = require("../../controllers/top5/historical.controller");

const AuthJWT = require("../../middleware/authJwt");

module.exports = function (app) {
  app.get("/api/boards", AuthJWT.verifyToken, async (req, res) => {
    const userId = { req };
    if (userId) {
      try {
        const boards = await controller.getAllBoards(req, res);

        for (let i = 0; i < boards.length; i++) {
          console.log("boards[i]", boards[i]);
          if (boards[i].indicator_id && boards[i].indicator) {
            boards[i].indicator["curves"] = boards[i].indicator.curve;
            delete boards[i].indicator.curve;
            boards[i].indicator["targets"] = boards[i].indicator.target;
            delete boards[i].indicator.target;
          }
        }
        return res.status(200).json(boards);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error: "GetAllBoards : " + error,
        });
      }
    }
    return res.status(401).json({ error: "Authentication fail" });
  });
  app.put("/api/boards", AuthJWT.verifyToken, async (req, res) => {
    const { userId } = req;
    const boards = req.body;
    const dashboardId = parseInt(req.query.dashboardId);
    if (userId) {
      try {
        const newBoards = await controller.updateManyBoards(
          boards,
          userId,
          dashboardId
        );

        for (let i = 0; i < newBoards.length; i++) {
          if (newBoards[i].indicator_id) {
            let indicator;
            try {
              indicator = await controllerIndicator.getOneIndicator(
                newBoards[i].indicator_id
              );
            } catch (error) {
              return res.status(400).json({
                error: "getOneIndicator : " + error,
              });
            }

            newBoards[i].indicator = indicator;
            newBoards[i].indicator = indicator;
            newBoards[i].indicator.curves = indicator.curve;
            delete indicator.curve;
            newBoards[i].indicator.targets = indicator.target;
            delete indicator.target;

            if (newBoards[i].periode === "historique") {
              try {
                historical =
                  await controllerHistorical.getHistoricalsByIndicator(
                    newBoards[i].indicator_id
                  );

                newBoards[i].indicator.historical = historical;
              } catch (error) {
                return res.status(400).json({
                  error: "getOneIndicator : " + error,
                });
              }
            }
          }
        }
        return res.status(200).json(newBoards);
      } catch (error) {
        return res.status(400).json({
          error: "GetAllBoards : " + error,
        });
      }
    }
    return res.status(401).json({ error: "Authentication fail" });
  });
  app.post("/api/boards", AuthJWT.verifyToken, controller.createBoard);
  app.delete("/api/board/:id", AuthJWT.verifyToken, controller.deleteBoard);
};
