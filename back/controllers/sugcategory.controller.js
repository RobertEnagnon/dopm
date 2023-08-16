const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllSugCategories = async (req, res, next) => {
  await prisma.sug_category
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllSugCategories : " + error,
      });
    });
};

exports.createSugCategory = async (req, res, next) => {
  const newSugCategory = await prisma.sug_category.create({
    data: {
      name: req.body.name,
    },
  });

  if (newSugCategory) {
    res.status(201).json({ sugCategory: newSugCategory });
  } else {
    next(new Error("Data incorrect"));
  }
};

exports.updateSugCategory = async (req, res, next) => {
  const stringId = req.params.id;
  const id = parseInt(stringId);
  const { name } = req.body;

  const existingSugCategory = await prisma.sug_category.findUnique({
    where: { id },
  });

  if (existingSugCategory) {
    const updatedSugCategory = await prisma.sug_category.update({
      where: { id },
      data: { name, updatedAt: new Date() },
    });

    if (updatedSugCategory) {
      res.status(200).json({ sugCategory: updatedSugCategory });
    } else {
      next(new Error("Data incorrect"));
    }
  } else {
    next(new Error("Suggestion category not found"));
  }
};

exports.deleteSugCategory = async (req, res, next) => {
  const stringId = req.params.id;
  const id = parseInt(stringId);

  const existingSugCategory = await prisma.sug_category.findUnique({
    where: { id },
  });

  if (existingSugCategory) {
    const updatedSugCategory = await prisma.sug_category.delete({
      where: { id },
    });

    if (updatedSugCategory) {
      res.status(200).json({ sugCategory: updatedSugCategory });
    } else {
      next(new Error("Data incorrect"));
    }
  } else {
    next(new Error("Suggestion category not found"));
  }
};
