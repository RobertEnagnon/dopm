const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les FS atcategories
exports.getAllClassifications = async (req, res, next) => {
  const classification = await prisma.fs_classification
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllClassifications : " + error,
      });
    });
};

// Récupérer une classification (id)
exports.getOneClassification = async (req, res, next) => {
  const classification = await prisma.fs_classification
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((classification) => {
      res.status(201).json(classification);
    })
    .catch((error) => {
      res.status(200).json({
        error: "getOneClassification : " + error,
      });
    });
};

// Récupérer une seule classification (name)
exports.getOneClassificationByName = async (req, res, next) => {
  const classification = await prisma.fs_classification
    .findUnique({
      where: {
        name: req.params.name,
      },
    })
    .then((classification) => {
      res.status(201).json(classification);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneClassificationByName : " + error,
      });
    });
};

// Créer une classification
exports.createClassification = async (req, res, next) => {
  let classificationName = req.body.name;
  let classificationDescription = req.body.description;
  classificationName = classificationName.trim();
  classificationDescription = classificationDescription.trim();

  const newClassification = await prisma.fs_classification.create({
    data: {
      name: classificationName,
      description: classificationDescription,
    },
  });

  console.log("classification added");
  console.log(newClassification);
  res.status(201).json({ newClassification: newClassification });
};

// Modifier une classification (id)
exports.updateClassification = async (req, res, next) => {
  console.log("updateClassification");

  let classificationName = req.body.name;
  let classificationDescription = req.body.description;

  console.log(req.body);

  const researchClassification = await prisma.fs_classification.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchClassification) {
    const updateClassification = await prisma.fs_classification
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: classificationName,
          description: classificationDescription,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Classification updated successfully!",
        });
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update Classification : " + error,
        });
      });

    console.log(updateClassification);
  }
};

// Supprimer une classification
exports.deleteClassification = async (req, res, next) => {
  console.log("deleteClassification");

  const researchClassification = await prisma.fs_classification.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchClassification) {
    const deleteClassification = await prisma.fs_classification.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json({
      message: "Classification deleted successfully!",
    });
  } else {
    res.status(400).json({
      error: "Bad classification id",
    });
  }
};
