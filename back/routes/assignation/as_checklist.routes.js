const controller = require("../../controllers/assignation/as_checklist.controller");

module.exports = function (app) {
    app.post('/api/as_tasks/:taskId/checklist', controller.createTaskChecklist);
    app.put('/api/as_tasks/:taskId/checklist/:id', controller.updateTaskChecklist);
    app.delete('/api/as_tasks/:taskId/checklist/:id', controller.deleteTaskChecklist);
};
