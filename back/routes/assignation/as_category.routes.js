const controller = require("../../controllers/assignation/as_category.controller");

module.exports = function (app) {
    app.get('/api/as_categories', controller.getAllAssignationCategories);
    app.get('/api/as_categories/:id', controller.getOneAssignationCategory);
    app.post('/api/as_categories', controller.createAssignationCategories);
    app.put('/api/as_categories/:id', controller.updateAssignationCategories);
    app.delete('/api/as_categories/:id', controller.deleteAssignationCategories);
};
