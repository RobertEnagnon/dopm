const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer toutes les zones
exports.getAllZones = async (req, res, next) => {
  console.log("getAllZones");

  const zone = await prisma.zone
    .findMany({
      include: {
        subzones: true,
      },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllZones : " + error,
      });
    });
};

// Récupérer une seule zone (id)
exports.getOneZone = async (req, res, next) => {
  console.log("getOneZone");

  const zone = await prisma.zone
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
      include: {
        subzones: true,
      },
    })
    .then((zone) => {
      res.status(201).json(zone);
    })
    .catch((error) => {
      res.status(200).json({
        error: "getOneZone : " + error,
      });
    });
};

// Récupérer une seule zone (name)
exports.getOneZoneByName = async (req, res, next) => {
  console.log("getOneZoneByName");

  const zone = await prisma.zone
    .findUnique({
      where: {
        name: req.params.name,
      },
    })
    .then((zone) => {
      res.status(201).json(zone);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneZoneByName : " + error,
      });
    });
};

// Créer une zone
exports.createZone = async (req, res, next) => {
  console.log("createZone");

  let zoneName = req.body.name;
  let zoneDescription = req.body.description;
  zoneName = zoneName.trim();
  zoneDescription = zoneDescription.trim();

  const newZone = await prisma.zone.create({
    data: {
      name: zoneName,
      description: zoneDescription,
    },
  });
  console.log("zone added");
  console.log(newZone);
  res.status(201).json({ newZone: newZone });
};

// Modifier une zone (id)
exports.updateZone = async (req, res, next) => {
  console.log("updateZone");

  let zoneName = req.body.name;
  let zoneDescription = req.body.description;

  console.log(req.body);

  const researchZone = await prisma.zone.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchZone) {
    const updateZone = await prisma.zone
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: zoneName,
          description: zoneDescription,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Zone updated successfully!",
        });
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update zone : " + error,
        });
      });

    console.log(updateZone);
  }
};

// Supprimer une zone
exports.deleteZone = async (req, res, next) => {
  console.log("deleteZone");

  const researchZone = await prisma.zone.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      subzones: true,
    },
  });
  if (researchZone) {
    const deleteZone = await prisma.zone.delete({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        subzones: true,
      },
    });
    res.status(201).json({
      message: "Zone deleted successfully!",
    });
  } else {
    res.status(201).json({
      error: "Bad Zone id",
    });
  }
};
