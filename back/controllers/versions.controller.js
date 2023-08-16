const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllVersions = async (req, res, next) => {
  console.log("getAllVersions");
  const versions = await prisma.versionning
    .findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        features: true,
      },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(404).json({ error: "GetAllVersion : " + err });
    });
};

exports.getOneVersion = async (req, res, next) => {
  console.log("getOneVersion");

  const version = await prisma.versionning
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((v) => {
      res.status(201).json(v);
    })
    .catch((err) => {
      res.status(200).json({ error: "GetOneVersion : " + err });
    });
};

exports.getLastVersion = async (req, res, next) => {
  console.log("getLastVersion");

  const version = await prisma.versionning
    .findMany({
      orderBy: {
        id: "desc",
      },
      take: 1,
    })
    .then((v) => {
      res.status(201).json(v);
    })
    .catch((e) => {
      res.status(404).json({ error: "GetLastVersion : " + e });
    });
};

exports.createVersion = async (req, res, next) => {
  console.log("createVersion");

  const versionName = req.body.name;
  const features = req.body.features.map((f) => ({
    name: f,
  }));

  // Vérifier si la version n'existe pas déjà
  const versionResearch = await prisma.versionning.findUnique({
    where: {
      name: versionName,
    },
  });

  // Si elle n'existe pas
  if (!versionResearch) {
    // La créer
    let newVersion = await prisma.versionning.create({
      data: {
        name: versionName,
        features: {
          create: features,
        },
      },
    });

    // La récupérer pour l'affecter à la response
    if (newVersion) {
      newVersion = await prisma.versionning.findUnique({
        where: {
          name: versionName,
        },
        include: {
          features: true,
        },
      });

      newVersion.features = newVersion.features.map((f) => f.name);
      res.status(201).json({ version: newVersion });
    } else res.status(404).json({ error: "Creation Failed" });
  } else {
    res.status(409).json({ error: "Version name already taken" });
  }
};

exports.updateVersion = async (req, res, next) => {
  console.log("updateVersion");

  let version = req.body;

  // Features associées à la version qui est modifiée
  const features = version.features.map((f) => ({
    name: f,
  }));

  const researchVersion = await prisma.versionning.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  // Vérifier que la version existe
  if (researchVersion) {
    const updateVersion = await prisma.versionning
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: version.name,
          date: version.date,
          // Supprimer toutes les features, puis en créer de nouvelles
          features: {
            deleteMany: {},
            create: features,
          },
        },
        include: { features: true },
      })
      .then((result) => {
        let frontVersion = result;
        frontVersion.features = result.features.map((f) => f.name);
        res.status(201).json({ version: frontVersion });
      })
      .catch((err) => {
        res.status(404).json({ error: "Update version : " + err });
      });
  }
};

exports.deleteVersion = async (req, res, next) => {
  console.log("deleteVersion");
  const researchVersion = await prisma.versionning.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchVersion) {
    const deleteVersion = await prisma.versionning.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json({ message: "Version deleted successfully!" });
  } else {
    res.status(404).json({ error: "Bad version id" });
  }
};
