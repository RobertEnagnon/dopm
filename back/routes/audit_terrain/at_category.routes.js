const controller = require("../../controllers/audit_terrain/at_category.controller");

module.exports = function (app) {
    app.get('/api/audit-categories', controller.getAllAuditCategories);
    app.get('/api/audit-categories/:id', controller.getOneAuditCategory);
    app.post('/api/audit-categories', controller.createAuditCategories);
    app.put('/api/audit-categories/:id', controller.updateAuditCategories);
    app.delete('/api/audit-categories/:id', controller.deleteAuditCategories);
};
