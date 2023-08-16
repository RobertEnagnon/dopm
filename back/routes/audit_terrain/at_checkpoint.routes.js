const controller = require("../../controllers/audit_terrain/at_checkpoint.controller");

module.exports = function (app) {
    app.get('/api/audit-checkpoint', controller.getAllCheckpoint);
    app.get('/api/audit-checkpoint/:id', controller.getOneCheckpoint);
    app.post('/api/audit-checkpoint', controller.createCheckpoint);
    app.put('/api/audit-checkpoint/:id', controller.updateCheckpoint);
    app.delete('/api/audit-checkpoint/:id', controller.deleteCheckpoint);
};
