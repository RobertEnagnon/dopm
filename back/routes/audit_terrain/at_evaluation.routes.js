const controller = require("../../controllers/audit_terrain/at_evaluation.controller");

module.exports = function (app) {
    app.get('/api/audit-evaluations', controller.getAllEvaluation)
    app.get('/api/audit-evaluations/:id', controller.getOneEvaluation)
    app.post('/api/audit-evaluations', controller.createManyEvaluations)
    app.put('/api/audit-evaluations/:ids', controller.updateManyEvaluations)
    app.delete('/api/audit-evaluations/:ids', controller.deleteManyEvaluations)
};
