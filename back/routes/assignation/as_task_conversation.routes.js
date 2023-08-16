const controller = require("../../controllers/assignation/as_task_conversation.controller");

module.exports = function (app) {
    app.post('/api/as_tasks/:taskId/conversation', controller.createAssignationConversation);
};