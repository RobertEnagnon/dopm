const controller = require("../../controllers/assignation/as_task.controller");

module.exports = function (app) {
    app.get('/api/as_tasks', controller.getAllTasks);
    app.get('/api/as_tasks/:tableId', controller.getAllTasks);
    app.post('/api/as_tasks', controller.createTask);
    app.put('/api/as_tasks/:id', controller.updateTask);
    app.delete('/api/as_tasks/:id', controller.deleteTask);
    app.put('/api/as_tasks_reorder', controller.reorderTasks);
};