const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPeriod = async (req, res, next) => {
  console.log("createPeriod");

  const period = req.body;
  if (period.day) period.day = period.day?.join(",");

  // Créer une période
  let newPeriod = await prisma.period.create({
    data: period,
  });

  console.log("newPeriod", newPeriod);

  if (newPeriod) return res.status(201).json(newPeriod);
  else return res.status(406).json({ error: "Creation Failed" });
};

exports.updatePeriod = async (req, res, next) => {
  console.log("updatePeriod");

  const period = req.body;
  if (period.day) period.day = period.day?.join(",");

  const researchPeriod = await prisma.versionning.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (researchPeriod) {
    const updatePeriod = await prisma.period
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: period,
      })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(400).json({ error: "Update version : " + err });
      });
  }

  res.status(404).json({ error: "Update version : " + err });
};
