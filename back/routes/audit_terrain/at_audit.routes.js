const controller = require("../../controllers/audit_terrain/at_audit.controller");

module.exports = function (app) {
    app.get('/api/audits', controller.getAllAudit);
    app.get('/api/audits/:serviceId/:date', controller.getAuditByServiceAndDate);
    app.get('/api/audits/:id', controller.getOneAudit);
    app.post('/api/audits', controller.createAudit);
    app.put('/api/audits/:id', controller.updateAudit);
    app.delete('/api/audits/:id', controller.deleteAudit);

    app.get('/api/audit-map', controller.getAuditMap);
    app.post('/api/audit-map', controller.createAuditMap);
    app.put('/api/audit-map/:id', controller.updateAuditMap);

    app.get('/api/audit-pareto/:serviceId/:year', controller.pareto);
    app.get('/api/audit-stats/:type/:args', controller.stats);
    app.get('/api/audit-stats/:type/', controller.stats);
};
