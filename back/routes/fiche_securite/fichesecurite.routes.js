const controller = require("../../controllers/fiches_securite/fichesecurite.controller");
const express = require("express");
// const fileUpload = require("express-fileupload");
// const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/api/fiches", async (req, res) => {
    try {
      const fiches = await controller.getAllFiches();
      res.status(200).json(fiches);
    } catch (error) {
      res.status(400).json({
        error: "getAllFiches : " + error,
      });
    }
  });
  app.get("/api/fiche/:id", controller.getOneFiche);
  app.post("/api/fiches", controller.createFiche);
  app.put("/api/fiches/:id", controller.updateFiche);
  app.delete("/api/fiches/:id", controller.deleteFiche);
  app.post("/api/fiches-upload", controller.upload);
  app.post("/api/fiche-image", controller.getImageFiche);
};
