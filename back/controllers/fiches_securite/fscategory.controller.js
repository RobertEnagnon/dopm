const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les FS atcategories
exports.getAllFSCategory = async (req, res, next) => {
  const fsCategory = await prisma.fs_category
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllFSCategory : " + error,
      });
    });
};

// Récupérer un seule fs categorie (id)
exports.getOneFSCategory = async (req, res, next) => {
  const fsCategory = await prisma.fs_category
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((fsCategory) => {
      res.status(201).json(fsCategory);
    })
    .catch((error) => {
      res.status(200).json({
        error: "getOneFSCategory : " + error,
      });
    });
};

// Récupérer un seule fs categorie (name)
exports.getOneFSCategoryByName = async (req, res, next) => {
  const fsCategory = await prisma.fs_category
    .findUnique({
      where: {
        name: req.params.name,
      },
    })
    .then((fsCategory) => {
      res.status(201).json(fsCategory);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneFSCategoryByName : " + error,
      });
    });
};

// Créer une fs category
exports.createFSCategorie = async (req, res, next) => {
  console.log("createFSCategorie");

  let fsCategoryName = req.body.name;
  let fsCategoryDescription = req.body.description;
  fsCategoryName = fsCategoryName.trim();
  fsCategoryDescription = fsCategoryDescription.trim();

  const newFSCategory = await prisma.fs_category.create({
    data: {
      name: fsCategoryName,
      description: fsCategoryDescription,
    },
  });

  console.log("fsCategory added");
  res.status(201).json({ newFSCategory: newFSCategory });
};

// Modifier une fs category (id)
exports.updateFSCategory = async (req, res, next) => {
  console.log("updateFSCategory");

  let fsCategoryName = req.body.name;
  let fsCategoryDescription = req.body.description;


  const researchFSCategory = await prisma.fs_category.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchFSCategory) {
    const updateFSCategory = await prisma.fs_category
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: fsCategoryName,
          description: fsCategoryDescription,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "FS Category updated successfully!",
        });
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update FS Category : " + error,
        });
      });

    console.log(updateFSCategory);
  }
};

// Supprimer un fs category
exports.deleteFSCategory = async (req, res, next) => {
  console.log("deleteFSCategory");

  const researchFSCategory = await prisma.fs_category.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchFSCategory) {
    const deleteFSCategory = await prisma.fs_category.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json({
      message: "FSCategory deleted successfully!",
    });
  } else {
    res.status(201).json({
      error: "Bad FSCategory id",
    });
  }
};
