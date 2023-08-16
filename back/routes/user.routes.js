const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/all", controller.allAccess);

  app.get(
    "/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  /*app.get(
    "/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );*/

  app.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get("/api/users/all", controller.getAllUsers);
  app.post("/api/users", async (req, res) => {
    try {
      res.status(201).json(await controller.createUser(req.body));
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  });
  app.put("/api/users/:id", async (req, res) => {
    try {
      res.status(201).json(await controller.updateUser(req.params.id, req.body));
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  });

  app.delete("/api/users/:id", controller.deleteUser);
};
