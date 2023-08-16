const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllSugClassifications = async (req, res, next) => {
  await prisma.sug_classification
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllSugClassifications : " + error,
      });
    });
};

exports.createSugClassification = async (req, res, next) => {
  const newSugClassification = await prisma.sug_classification.create({
    data: {
      name: req.body.name,
    },
  });

  if (newSugClassification) {
    res.status(201).json({ sugClassification: newSugClassification });
  } else {
    next(new Error("Data incorrect"));
  }
};

exports.updateSugClassification = async (req, res, next) => {
  const stringId = req.params.id;
  const id = parseInt(stringId);
  const { name } = req.body;

  const existingSugClassification = await prisma.sug_classification.findUnique({
    where: { id },
  });

  if (existingSugClassification) {
    const updatedSugClassification = await prisma.sug_classification.update({
      where: { id },
      data: { name, updatedAt: new Date() },
    });

    if (updatedSugClassification) {
      res.status(200).json({ sugClassification: updatedSugClassification });
    } else {
      next(new Error("Data incorrect"));
    }
  } else {
    next(new Error("Suggestion classification not found"));
  }
};

exports.deleteSugClassification = async (req, res, next) => {
  const stringId = req.params.id;
  const id = parseInt(stringId);

  const existingSugClassification = await prisma.sug_classification.findUnique({
    where: { id },
  });

  if (existingSugClassification) {
    const updatedSugClassification = await prisma.sug_classification.delete({
      where: { id },
    });

    if (updatedSugClassification) {
      res.status(200).json({ sugClassification: updatedSugClassification });
    } else {
      next(new Error("Data incorrect"));
    }
  } else {
    next(new Error("Suggestion classification not found"));
  }
};
