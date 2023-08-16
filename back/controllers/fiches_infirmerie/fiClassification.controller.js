const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les Fi categories
exports.getAllCategory = async (req, res, next) => {
  await prisma.fi_classification
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllCategory fiClassification: " + error,
      })
    })
}

// Récupérer un seule fi categorie (id)
exports.getOneCategory = async (req, res, next) => {
  await prisma.fi_classification
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((ficategory) => {
      res.status(201).json(ficategory)
    })
    .catch((error) => {
      res.status(200).json({
        error: "getOneCategory fiClassification: " + error,
      })
    })
}

// Récupérer un seule fi categorie (name)
exports.getOneCategoryByName = async (req, res, next) => {
  await prisma.fi_classification
    .findUnique({
      where: {
        name: req.params.name,
      },
    })
    .then((ficategory) => {
      res.status(201).json(ficategory)
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneCategoryByName fiClassification: " + error,
      })
    })
};

// Créer une fi category
exports.createCategorie = async (req, res, next) => {
  console.log("createCategorie");

  let fiCategoryName = req.body.name
  let fiCategoryDescription = req.body.description
  fiCategoryName = fiCategoryName.trim()

  const newCategory = await prisma.fi_classification.create({
    data: {
      name: fiCategoryName,
      description: fiCategoryDescription
    }
  })

  console.log("fiClassification added")
  res.status(201).json({ newCategory: newCategory })
};

// Modifier une fi category (id)
exports.updateCategory = async (req, res, next) => {
  console.log("updateCategory");

  let fiCategoryName = req.body.name
  let fiCategoryDescription = req.body.description

  const researchFiCategory = await prisma.fi_classification.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (researchFiCategory) {
    const updateCategory = await prisma.fi_classification
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: fiCategoryName,
          description: fiCategoryDescription,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "fiClassification updated successfully!",
        })
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update fiClassification : " + error,
        })
      })

    console.log(updateCategory)
  }
};

// Supprimer un fi category
exports.deleteCategory = async (req, res, next) => {
  console.log("deleteCategory");

  const researchCategory = await prisma.fi_classification.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (researchCategory) {
    await prisma.fi_classification.delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(201).json({
      message: "fiClassification deleted successfully!",
    })
  } else {
    res.status(201).json({
      error: "Bad fiClassification id",
    })
  }
}