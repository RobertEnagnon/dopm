const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les Fi atcategories
exports.getAllCategory = async (req, res, next) => {
  await prisma.fi_careprovided
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      console.log('error careProvided', error);
      res.status(201).json({
        error: "getAllCategory materialelements: " + error,
      })
    })
}

// Récupérer un seule fi categorie (id)
exports.getOneCategory = async (req, res, next) => {
  await prisma.fi_careprovided
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
        error: "getOneCategory materialelements: " + error,
      })
    })
}

// Récupérer un seule fi categorie (name)
exports.getOneCategoryByName = async (req, res, next) => {
  await prisma.fi_careprovided
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
        error: "getOneCategoryByName materialelements: " + error,
      })
    })
};

// Créer une fi category
exports.createCategorie = async (req, res, next) => {
  console.log("createCategorie");

  let fiCategoryName = req.body.name
  fiCategoryName = fiCategoryName.trim()

  const newCategory = await prisma.fi_careprovided.create({
    data: {
      name: fiCategoryName
    }
  })

  console.log("fiInjCategory added")
  res.status(201).json({ newCategory: newCategory })
};

// Modifier une fi category (id)
exports.updateCategory = async (req, res, next) => {
  console.log("updateCategory");

  let fiCategoryName = req.body.name;

  const researchFiCategory = await prisma.fi_careprovided.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (researchFiCategory) {
    const updateCategory = await prisma.fi_careprovided
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: fiCategoryName,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Fi Category updated successfully!",
        })
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update Fi Category : " + error,
        })
      })

    console.log(updateCategory)
  }
};

// Supprimer un fi category
exports.deleteCategory = async (req, res, next) => {
  console.log("deleteCategory");

  const researchCategory = await prisma.fi_careprovided.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (researchCategory) {
    await prisma.fi_careprovided.delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(201).json({
      message: "FiCategory deleted successfully!",
    })
  } else {
    res.status(201).json({
      error: "Bad FiCategory id",
    })
  }
}