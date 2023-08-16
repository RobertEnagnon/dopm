const controller = require("../controllers/team.controller");

module.exports = function (app) {
  app.get("/api/teams", controller.getAllTeams);
  app.get("/api/team/:id", controller.getOneTeam);
  app.get("/api/teamByName/:name", controller.getOneTeamByName);
  app.post("/api/teams", controller.createTeam);
  app.put("/api/teams/:id", controller.updateTeam);
  app.delete("/api/teams/:id", controller.deleteTeam);
};
