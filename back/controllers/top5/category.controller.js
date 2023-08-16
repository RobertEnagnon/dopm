const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateCategory = async (req, res, next) => {
  console.log("updateCategory");
  console.log(req.params.id);

  const researchCategory = await prisma.top5_category.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchCategory) {
    const updateCategory = await prisma.top5_category
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name,
          orderCategory: req.body.orderCategory,
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Post updated successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "UpdateCategory : " + error,
        });
      });
  }
};

exports.deleteCategory = async (req, res, next) => {
  console.log("deleteCategory");
  console.log(req.params.id);

  const researchCategory = await prisma.top5_category.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  console.log(researchCategory);
  if (researchCategory) {
    console.log("deleteCategory => researchCategory");
    const updateCategory = await prisma.top5_category.update({
      where: {
        id: parseInt(researchCategory.id),
      },
      data: {
        branch_id: 0,
      },
    });
    console.log("updateCategory");
    console.log(updateCategory);

    const deleteCategory = await prisma.top5_category.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(201).json(true);
  } else {
    next(new Error("Category not finded"));
  }
};

exports.createCategory = async (req, res, next) => {
  console.log("createCategory");
  let categoryName = req.body.name;
  categoryName = categoryName.trim();

  const branchId = parseInt(req.body.branch_id);
  console.log(branchId);

  const branchresearch = await prisma.top5_branch.findFirst({
    where: {
      id: parseInt(branchId),
    },
  });

  if (branchresearch) {
    const researchOrderCategorie = await prisma.top5_category.findMany({
      where: { branch_id: branchresearch.id },
      orderBy: {
        orderCategory: "desc",
      },
    });

    if (researchOrderCategorie[0] === undefined) orderCategory = 1;
    else orderCategory = researchOrderCategorie[0].orderCategory + 1;

    const newCategory = await prisma.top5_category.create({
      data: {
        name: categoryName,
        orderCategory: orderCategory,
        branch_id: branchId,
      },
    });
    if (newCategory) {
      const newCategory = await prisma.top5_category.findMany({
        where: {
          name: categoryName,
        },
      });
      res.status(201).json({ category: newCategory[newCategory.length - 1] });
    }
  } else {
    next(new Error("wrongId"));
  }
};

exports.getOneCategory = async (req, res, next) => {
  const category = await prisma.top5_category
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetOneCategory : " + error,
      });
    });
};

exports.getAllCategory = async (id) => {

  return await prisma.top5_category
    .findMany({
      where: {
        branch_id: id,
      },
      orderBy: {
        orderCategory: "asc",
      },
      include: {
        indicator: true,
      },
    });
};

exports.exportAllCategory = async (req, res, next) => {
  console.log("getAllCategory");

  const category = await prisma.top5_category
    .findMany({
      orderBy: {
        id: "asc",
      },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetAllCategory : " + error,
      });
    });
};
