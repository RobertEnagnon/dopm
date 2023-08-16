const controller = require("../../controllers/assignation/as_table.controller");

module.exports = function (app) {
    app.get('/api/as_tables', controller.getAllTables);
    // app.get('/api/as_tables/:id', controller.getOneTable);
    app.post('/api/as_tables', controller.createTable);
    app.put('/api/as_tables/:id', controller.updateTable);
    app.delete('/api/as_tables/:id', controller.deleteTable);
    app.put('/api/as_tables_reorder', controller.reorderTables);
};