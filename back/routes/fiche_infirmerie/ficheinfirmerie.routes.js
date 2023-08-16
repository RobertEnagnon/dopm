const controller = require("../../controllers/fiches_infirmerie/ficheinfirmerie.controller")
const express = require("express")

module.exports = function (app) {
  app.get("/api/fichesinf", controller.getAllFiches);
  app.get("/api/ficheinf/:id", controller.getOneFiche);
  app.post("/api/fichesinf", controller.createFiche);
  app.put("/api/fichesinf/:id", controller.updateFiche);
  app.delete("/api/fichesinf/:id", controller.deleteFiche);
  app.post("/api/fichesinf-upload", controller.upload);
  app.post("/api/ficheinf-image", controller.getImageFiche);
}
