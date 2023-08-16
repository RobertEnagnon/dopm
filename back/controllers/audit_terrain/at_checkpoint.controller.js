const { PrismaClient } = require('@prisma/client');
//const {check} = require("prisma");
const prisma = new PrismaClient();
const fs = require("fs");

exports.getAllCheckpoint = async (req, res, next) => {
  console.log("getAllCheckpoint");

    const checkpoint = await prisma.at_checkpoint
        .findMany({
            orderBy: [{ createdAt: 'asc' }],
            include: {
                category: true,
                subzone: true,
                zone: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        subzones: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                checkpoint_service: {
                    select: {
                        service: true
                    }
                },
                period: true,
          },
        })
      .then((result) => {
        // Transformer 'Lundi,Mardi' en ['Lundi', 'Mardi']
        result.map((c) => {
          if (c.period && c.period.day) c.period.day = c.period.day.split(",");
        });
        res.status(201).json(result);
      })

        .catch(error => {
            res.status(400).json({
                error: `getAllCheckpoint : ${error}`
            });
        });
}
exports.getOneCheckpoint = async (req, res, next) => {
  console.log("getOneCheckpoint");

  const { id } = req.params;

  const audit = await prisma.at_checkpoint
    .findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        period: true,
      },
    })
    .then((checkpoint) => {
      res.status(201).json(checkpoint);
    })
    .catch((error) => {
      res.status(200).json({
        error: `getOneCheckpoint : ${error}`,
      });
    });
};

exports.createCheckpoint = async (req, res, next) => {
  console.log("createCheckpoint");

  const {
    standard,
    description,
    image,
    services,
    zoneId,
    subzoneId,
    categoryId,
    numero,
    user,
    period,
  } = req.body;

  // On transforme ['Lundi', 'Mardi'] en 'Lundi,Mardi'
  let newPeriod = { ...period };
  delete newPeriod.day;
  if (period.day) newPeriod.day = period.day.join(",");

  if (standard && zoneId) {
    const newCheckpoint = await prisma.at_checkpoint.create({
      data: {
        standard: standard,
        description: description,
        numero: parseInt(numero),
        image: image,
        createdAt: new Date(),
        createdBy: user?.id?.toString(),
        updatedAt: new Date(),
        updatedBy: user?.id?.toString(),
        zoneId: zoneId ? parseInt(zoneId) : null,
        subzoneId: subzoneId ? parseInt(subzoneId) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        period: {
          create: newPeriod,
        },
      },
    });
    if( services ) {
      for( const service of services ) {
          const checkpoint_service = await prisma.at_checkpoint_service.create({
              data: {
                  id_service: service.id,
                  id_atcheckpoint: newCheckpoint.id
              }
          })
      }
  }
    const checkpoint = await prisma.at_checkpoint.findUnique({
      where: {
        id: parseInt(newCheckpoint.id),
      },
      include: {
        category: true,
        subzone: true,
        zone: {
          select: {
            id: true,
            name: true,
            description: true,
            subzones: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        period: true,
        checkpoint_service: {
          select: {
              service: true
          }
        }
      },
    });
    const checkpointServices = checkpoint.checkpoint_service.map(cs => cs.service);
    res.status(201).json({ newCheckpoint : {...checkpoint, services: checkpointServices } });
  } else if (!standard) {
    console.log(`createCheckpoint : No Standard Provided`);
    res.status(200).json({
      error: `No Standatd Provided`,
    });
  } else if (!zoneId) {
    console.log(`createCheckpoint : No Zone Provided`);
    res.status(200).json({
      error: `No Zone Provided`,
    });
  }
};

exports.updateCheckpoint = async (req, res, next) => {
  console.log("updateCheckpoint");

  const { id } = req.params;
  const {
    standard,
    description,
    numero,
    image,
    services,
    zoneId,
    subzoneId,
    categoryId,
    user,
    period,
  } = req.body;

  // On transforme ['Lundi', 'Mardi'] en 'Lundi,Mardi'
  let newPeriod = { ...period };
  if (period.day) newPeriod.day = period.day.join(",");
  delete newPeriod.checkpointId;

  console.log("period", newPeriod);

  const researchCheckpoint = await prisma.at_checkpoint.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (researchCheckpoint) {
    /**
         * On supprime l'ancienne image si elle est differente
         */
     if(researchCheckpoint.image !== image){
      const pathDisk = process.cwd() + "/public" + researchCheckpoint.image
      fs.access(pathDisk, (err) => {
          if(!err){
              fs.unlinkSync(pathDisk)
          }
      })
  }
  /**
   * On met a jour le checkpoint
   */
    const updateCheckpoint = await prisma.at_checkpoint
      .update({
        where: {
          id: parseInt(id),
        },
        data: {
          standard: standard,
          description: description,
          numero: parseInt(numero),
          image,
          updatedAt: new Date(),
          updatedBy: user?.id?.toString(),
          zoneId: zoneId ? parseInt(zoneId) : null,
          subzoneId: subzoneId ? parseInt(subzoneId) : null,
          categoryId: categoryId ? parseInt(categoryId) : null,
          period: {
            upsert: {
              create: newPeriod,
              update: newPeriod,
            },
          },
        },
      })
      .then(async () => {
        const deleteCheckpointService = await prisma.at_checkpoint_service.deleteMany({
          where: {
              id_atcheckpoint: parseInt(id)
          }
      });
      if( services ) {
          for( const service of services ) {
              const checkpoint_service = await prisma.at_checkpoint_service.create({
                  data: {
                      id_service: service.id,
                      id_atcheckpoint: parseInt(id)
                  }
              })
          }
      }
        const checkpoint = await prisma.at_checkpoint.findUnique({
          where: {
            id: parseInt(id),
          },
          include: {
            category: true,
            subzone: true,
            zone: {
              select: {
                id: true,
                name: true,
                description: true,
                subzones: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            period: true,
            checkpoint_service: {
              select: {
                  service: true
              }
          }
          },
        });
        const checkpointServices = checkpoint.checkpoint_service.map(cs => cs.service);
        // Transformer 'Lundi,Mardi' en ['Lundi', 'Mardi']
        checkpoint.period.day = period.day;

        res.status(201).json({
          message: "Checkpoint updated successfully!",
          checkpoint: {...checkpoint, services: checkpointServices}
        });
      })
      .catch((error) => {
        res.status(404).json({
          error: `UpdateCheckpoint : ${error}`,
        });
      });
  }
};

exports.deleteCheckpoint = async (req, res, next) => {
  console.log("deleteCheckpoint");

  const { id } = req.params;

  const researchCheckpoint = await prisma.at_checkpoint.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (researchCheckpoint) {
    /**
         * On supprime l'iamge
         */
     const pathDisk = process.cwd() + "/public" + researchCheckpoint.image
     fs.access(pathDisk, (err) => {
         if(!err){
             fs.unlinkSync(pathDisk)
         }
     })
    /**
     * On supprime le checkpoint
     */
    const deleteCheckpointService = await prisma.at_checkpoint_service.deleteMany({
        where: {
            id_atcheckpoint: parseInt(id)
        }
    });
    const deleteCheckpoint = await prisma.at_checkpoint.delete({
      where: {
        id: parseInt(id),
      },
    });

    // Supprimer aussi la période
    const researchPeriod = await prisma.period.findUnique({
      where: { checkpointId: parseInt(id) },
    });

    if (researchPeriod) {
      await prisma.period.delete({
        where: { checkpointId: parseInt(id) },
      });
    }

    res.status(201).json({
      message: "Checkpoint deleted successfully!",
    });
  } else {
    res.status(400).json({
      error: "Bad id",
    });
  }
};
