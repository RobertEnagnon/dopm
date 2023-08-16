const controller = require("../../controllers/assignation/as_board.controller");

module.exports = function(app) {
    app.get("/api/as_boards", controller.getAllASBoards);
    app.get("/api/as_boards/:id", controller.getOneASBoard);
    app.post("/api/as_boards", controller.createASBoard);
    app.put("/api/as_boards/:id", controller.updateASBoard);
    app.delete("/api/as_boards/:id", controller.deleteASBoard);
};