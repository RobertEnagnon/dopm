const controller = require("../../controllers/assignation/as_responsible.controller");

module.exports = function (app) {
    app.post('/api/as_tasks/:taskId/responsible', controller.createTaskResponsible);
    app.delete('/api/as_tasks/:taskId/responsible/:id', controller.deleteTaskResponsible);
};
