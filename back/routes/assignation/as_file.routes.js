const controller = require("../../controllers/assignation/as_file.controller");

module.exports = function (app) {
    app.post('/api/as_tasks/:taskId/file', controller.createTaskFile);
    app.delete('/api/as_tasks/:taskId/file/:id', controller.deleteTaskFile);
};
