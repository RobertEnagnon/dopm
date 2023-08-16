const controller = require("../controllers/language.controller");
const express = require("express");
// const fileUpload = require("express-fileupload");
// const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/api/languages", controller.getAllLanguage);
//   app.get("/api/language/:id", controller.getOneLanguage);
  app.post("/api/languages", controller.createLanguage);
//   app.put("/api/languages/:id", controller.updateLanguage);
//   app.delete("/api/languages/:id", controller.deleteLanguage);
};
