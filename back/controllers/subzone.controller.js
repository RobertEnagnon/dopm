const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateSubZone = async (req, res, next) => {
  console.log("updateSubZone");
  console.log(req.params.id);

  const researchSubZone = await prisma.subzone.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchSubZone) {
    const updateSubZone = await prisma.subzone
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name,
        },
      })
      .then(() => {
        res.status(201).json({
          message: "SubZone updated successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "updateSubZone : " + error,
        });
      });
  } else {
    res.status(201).json({error: "Subzone non trouvée"})
  }
};

exports.deleteSubZone = async (req, res, next) => {
  console.log("deleteSubZone");
  console.log(req.params.id);

  const researchSubZone = await prisma.subzone.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchSubZone) {
    const deleteSubZone = await prisma.subzone.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(201).json({message: "Subzone supprimée"});
  } else {
    res.status(201).json({error: "Subzone non trouvée"});
  }
};

exports.createSubZone = async (req, res, next) => {
  console.log("createSubZone");
  let subZoneName = req.body.name;
  subZoneName = subZoneName.trim();

  const zoneId = parseInt(req.body.zoneId);
  console.log(zoneId);

  //a checker en fonction de la zone
  const subZoneResearch = await prisma.subzone.findFirst({
    where: {
      name: subZoneName,
      zone_id: zoneId,
    },
  });

  const zoneResearch = await prisma.zone.findFirst({
    where: {
      id: parseInt(zoneId),
    },
  });

  if (!subZoneResearch && zoneResearch) {
    const newSubZone = await prisma.subzone.create({
      data: {
        name: subZoneName,
        zone_id: zoneId,
      },
    });
    if (newSubZone) {
      const newSubZone = await prisma.subzone.findMany({
        where: {
          name: subZoneName,
        },
      });
      res.status(201).json({ subZone: newSubZone[newSubZone.length - 1] });
    }
  } else {
    next(new Error("wrongId"));
  }
};

exports.getOneSubZone = async (req, res, next) => {
  const subZone = await prisma.subzone
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((subZone) => {
      res.status(200).json(subZone);
    })
    .catch((error) => {
      res.status(400).json({
        error: "getOneSubZone : " + error,
      });
    });
};

exports.getAllSubZones = async (req, res, next) => {
  console.log("getAllSubZones");

  const subZone = await prisma.subzone
    .findMany({
      where: {
        zone_id: parseInt(req.params.id, 10),
      },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(400).json({
        error: "getAllSubZones : " + error,
      });
    });
};
