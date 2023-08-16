const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les Fi inj atcategories
exports.getAllFiInjCategory = async (req, res, next) => {
  await prisma.fi_injuredcategory
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      console.log('error injuredCategory', error);
      res.status(201).json({
        error: "getAllFiInjCategory : " + error,
      });
    });
};

// Récupérer un seule fi inj categorie (id)
exports.getOneFiInjCategory = async (req, res, next) => {
  const fiInjCategory = await prisma.fi_injuredcategory
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((fiInjCategory) => {
      res.status(201).json(fiInjCategory)
    })
    .catch((error) => {
      res.status(200).json({
        error: "getOneFiInjCategory : " + error,
      })
    })
}

// Récupérer un seule fi inj categorie (name)
exports.getOneFiInjCategoryByName = async (req, res, next) => {
  const fiInjCategory = await prisma.fi_injuredcategory
    .findUnique({
      where: {
        name: req.params.name,
      },
    })
    .then((fiInjCategory) => {
      res.status(201).json(fiInjCategory)
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneFiInjCategoryByName : " + error,
      })
    })
};

// Créer une fi inj category
exports.createFiInjCategorie = async (req, res, next) => {
  console.log("createFiInjCategorie");

  let fiCategoryName = req.body.name
  fiCategoryName = fiCategoryName.trim()

  const newFiInjCategory = await prisma.fi_injuredcategory.create({
    data: {
      name: fiCategoryName,
      isInjuredCategoryName: req.body.isInjuredCategoryName
    }
  })

  console.log("fiInjCategory added")
  res.status(201).json({ newFiInjCategory: newFiInjCategory })
};

// Modifier une fi inj category (id)
exports.updateFiInjCategory = async (req, res, next) => {
  console.log("updateFiInjCategory");

  let fiInjCategoryName = req.body.name;
  let isInjuredCategoryName = req.body.isInjuredCategoryName

  const researchFiInjCategory = await prisma.fi_injuredcategory.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (researchFiInjCategory) {
    const updateFiInjCategory = await prisma.fi_injuredcategory
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: fiInjCategoryName,
          isInjuredCategoryName: isInjuredCategoryName,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Fi Inj Category updated successfully!",
        });
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update Fi Inj Category : " + error,
        });
      });

    console.log(updateFiInjCategory);
  }
};

// Supprimer un fi inj category
exports.deleteFiInjCategory = async (req, res, next) => {
  console.log("deleteFiInjCategory");

  const researchFiInjCategory = await prisma.fi_injuredcategory.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  if (researchFiInjCategory) {
    const deletedFiInjCategory = await prisma.fi_injuredcategory.delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(201).json({
      message: "FiInjCategory deleted successfully!",
    })
  } else {
    res.status(201).json({
      error: "Bad FiInjCategory id",
    })
  }
}
