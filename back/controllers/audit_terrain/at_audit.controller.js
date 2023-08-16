const { PrismaClient } = require("@prisma/client");
const {getParetoDiagram, getNokByMonth, getNokByYear, getNokByZone, getAnnuelByZone, getAnnuelByStatus } = require("../../services/audit_terrain/stats");
const prisma = new PrismaClient();

exports.getAllAudit = async (req, res, next) => {
  console.log("getAllAudit");

  const audit = await prisma.at_audit
    .findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        Evaluations: true,
      },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(400).json({
        error: `getAllAudit : ${error}`,
      });
    });
};

exports.getAuditByServiceAndDate = async (req, res, next) => {
  console.log("getAuditByServiceAndDate");

  const { serviceId, date } = req.params;
  if (serviceId && date) {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 1);

    const audits = await prisma.at_audit
      .findMany({
        orderBy: [{ createdAt: "desc" }],
        include: {
          service: true,
          Evaluations: {
            select: {
              id: true,
              check: true,
              comment: true,
              image: true,
              createdAt: true,
              createdBy: true,
              updatedAt: true,
              updatedBy: true,
              checkpoint: {
                select: {
                  id: true,
                  numero: true,
                  standard: true,
                  description: true,
                  createdAt: true,
                  createdBy: true,
                  updatedAt: true,
                  updatedBy: true,
                  image: true,
                  zone: true,
                  subzone: true,
                  category: true,
                  period: true,
                },
              },
            },
          },
        },
        where: {
          serviceId: parseInt(serviceId, 10),
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      })
      .then((result) => {
        // Transformer 'Lundi,Mardi' en ['Lundi', 'Mardi']
        result.map((audit) => {
          audit.Evaluations.map((eval) => {
            if (eval.checkpoint.period && eval.checkpoint.period.day)
              eval.checkpoint.period.day =
                eval.checkpoint.period.day.split(",");
          });
        });
        res.status(201).json(result);
      })
      .catch((error) => {
        res.status(200).json({
          error: `getAuditByServiceAndDate : ${error}`,
        });
      });
  } else if (!serviceId) {
    console.log(`getAuditByServiceAndDate : No service provided`);
    res.status(200).json({
      error: `No service provided`,
    });
  } else if (!date) {
    console.log(`getAuditByServiceAndDate : No date provided`);
    res.status(200).json({
      error: `No date provided`,
    });
  }
};

exports.getOneAudit = async (req, res, next) => {
  console.log("getOneAudit");
  const audit = await prisma.at_audit
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
      include: {
        Evaluations: true,
      },
    })
    .then((audit) => {
      res.status(201).json(audit);
    })
    .catch((error) => {
      res.status(200).json({
        error: `getOneAudit : ${error}`,
      });
    });
};

exports.createAudit = async (req, res, next) => {
  console.log("createAudit");

  const { serviceId, date, user, evaluations } = req.body;

  if (date && serviceId) {
    const newAudit = await prisma.at_audit.create({
      data: {
        date: new Date(date),
        serviceId: parseInt(serviceId),
        createdBy: user?.id?.toString(),
        updatedBy: user?.id?.toString(),
      },
    });
    for (const eval of evaluations) {
      const e = await prisma.at_evaluation.create({
        data: {
          check: eval.check,
          comment: eval.comment,
          image: eval.image,
          checkpointId: eval.checkpoint.id,
          auditId: newAudit.id,
          createdBy: user?.id?.toString(),
          updatedBy: user?.id?.toString(),
        },
      });
    }
    const audit = await prisma.at_audit.findUnique({
      where: {
        id: parseInt(newAudit.id),
      },
      include: {
        Evaluations: {
          select: {
            id: true,
            check: true,
            comment: true,
            image: true,
            createdAt: true,
            createdBy: true,
            updatedAt: true,
            updatedBy: true,
            checkpoint: {
              select: {
                id: true,
                numero: true,
                standard: true,
                description: true,
                createdAt: true,
                createdBy: true,
                updatedAt: true,
                updatedBy: true,
                image: true,
                zone: true,
                subzone: true,
                category: true,
                period: true,
              },
            },
          },
        },
        service: true,
      },
    });

    res.status(201).json({ newAudit: audit });
  } else if (!date) {
    console.log(`createAudit : No Date Provided`);
    res.status(200).json({
      error: `No Date Provided`,
    });
  } else if (!serviceId) {
    console.log(`createAudit : No service provided`);
    res.status(200).json({
      error: `No service provided`,
    });
  }
};

exports.updateAudit = async (req, res, next) => {
  console.log("updateAudit");

  const { id } = req.params;
  const { serviceId, date, evaluations } = req.body;

  if (date && serviceId) {
    const researchAudit = await prisma.at_audit.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Evaluations: true,
      },
    });
    if (researchAudit) {
      for (const eval of evaluations) {
        const updatedEval = await prisma.at_evaluation.update({
          where: {
            id: parseInt(eval.idEval),
          },
          data: {
            check: eval.check,
            comment: eval.comment,
            image: eval.image,
          },
        });
      }
      const updatedAudit = await prisma.at_audit.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          Evaluations: {
            select: {
              id: true,
              check: true,
              comment: true,
              image: true,
              createdAt: true,
              createdBy: true,
              updatedAt: true,
              updatedBy: true,
              checkpoint: {
                select: {
                  id: true,
                  numero: true,
                  standard: true,
                  description: true,
                  createdAt: true,
                  createdBy: true,
                  updatedAt: true,
                  updatedBy: true,
                  image: true,
                  zone: true,
                  subzone: true,
                  category: true,
                  period: true,
                },
              },
            },
          },
          service: true,
        },
      });

      // Transformer 'Lundi,Mardi' en ['Lundi', 'Mardi']
      updatedAudit.Evaluations.map((eval) => {
        console.log("eval.checkpoint.period", eval.checkpoint.period);
        if (eval.checkpoint.period && eval.checkpoint.period.day)
          eval.checkpoint.period.day = eval.checkpoint.period.day.split(",");
      });

      res.status(201).json({ updatedAudit: updatedAudit });
    } else {
      console.log(`updateAudit : No audit found`);
      res.status(200).json({
        error: `No audit found`,
      });
    }
  } else if (!date) {
    console.log(`updateAudit : No Date Provided`);
    res.status(200).json({
      error: `No Date Provided`,
    });
  } else if (!serviceId) {
    console.log(`updateAudit : No service provided`);
    res.status(200).json({
      error: `No service provided`,
    });
  }
};

exports.deleteAudit = async (req, res, next) => {
  console.log("deleteAudit");

  const { id } = req.params;

  const researchAudit = await prisma.at_audit.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (researchAudit) {
    const deleteAudit = await prisma.at_audit.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(201).json({
      message: "Audi deleted successfully!",
    });
  } else {
    res.status(400).json({
      error: "Bad id",
    });
  }
};

exports.getAuditMap = async (req, res, next) => {
  console.log("getAuditMap");
  const auditMap = await prisma.at_map
    .findMany({
      orderBy: [{ id: "desc" }],
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(400).json({
        error: `getAuditMap : ${error}`,
      });
    });
};

exports.createAuditMap = async (req, res, next) => {
  console.log("createAuditMap");

  const { image } = req.body;
  if (image) {
    const newAuditMap = await prisma.at_map.create({
      data: {
        image: image,
      },
    });
    const auditMap = await prisma.at_map.findUnique({
      where: {
        id: parseInt(newAuditMap.id),
      },
    });
    res.status(201).json({ newAuditMap: auditMap });
  } else if (!image) {
    console.log("createAuditMap : No image provided");
    res.status(200).json({
      error: "No image provided",
    });
  }
};

exports.updateAuditMap = async (req, res, next) => {
  console.log("updateAuditMap");

  const { id } = req.params;
  const { image } = req.body;

  if (image) {
    const researchAuditMap = await prisma.at_map.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (researchAuditMap) {
      const updatedAuditMap = await prisma.at_map.update({
        where: {
          id: parseInt(id),
        },
        data: {
          image: image,
        },
      });
      res.status(201).json({ updatedAuditMap: updatedAuditMap });
    } else {
      console.log(`updateAuditMap : No AuditMap found`);
      res.status(200).json({
        error: `No AuditMap found`,
      });
    }
  } else if (!image) {
    console.log("updateAuditMap : No image provided");
    res.status(200).json({
      error: "No image provided",
    });
  }
};

exports.pareto = async (req, res, next) => {
  const { serviceId, year } = req.params;

  if( serviceId && year ) {
    let paretoDiagram = await getParetoDiagram(parseInt(serviceId), year);
    res.status(200).json(paretoDiagram);
  } else {
    res.status(200).json({
      error: 'Incorrect request'
    })
  }
};

exports.stats = async (req, res, next) => {
  const { type, args } = req.params;

  switch ( type ) {
    case 'NOKByMonth':
      console.log(args)
      if( args ) {
        let NokByMonth = await getNokByMonth(new Date(args));
        res.status(200).json(NokByMonth);
      } else {
        res.status(200).json({
          error: 'Incorrect request'
        })
      }
      break;
    case 'NOKByYear':
      if( args ) {
        let NokByYear = await getNokByYear(new Date(args));
        res.status(200).json(NokByYear);
      } else {
        res.status(200).json({
          error: 'Incorrect request'
        })
      }
      break;
    case 'NOKByZone':
      const [serviceId, date] = args.split(',');
      let NokByZone = await getNokByZone(parseInt(serviceId), new Date(date));
      res.status(200).json(NokByZone);
      break;
    case 'AnnuelByZone':
      if( args ) {
        let NokByZone = await getAnnuelByZone(new Date(args));
        res.status(200).json(NokByZone);
      } else {
        res.status(200).json({
          error: 'Incorrect request'
        })
      }
      break;
    case 'AnnuelByStatus':
      if( args ) {
        const [serviceId, date] = args.split(',');
        let NokByZone = await getAnnuelByStatus(parseInt(serviceId), new Date(date));
        res.status(200).json(NokByZone);
      } else {
        res.status(200).json({
          error: 'Incorrect request'
        })
      }
      break;
    default:
      res.status(200).json({
        error: 'Incorrect request'
      })
  }
}
