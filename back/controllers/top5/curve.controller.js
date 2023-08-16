const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateCurve = async (req, res, next) => {
  console.log("updateCurve");
  console.log(req.params.id);

  const researchCurveById = await prisma.top5_curve.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchCurveById) {
    const updateOneCurve = await prisma.top5_curve
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name,
          curveType: parseInt(req.body.curveType),
          color: req.body.color,
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Post updated successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "UpdateCurve : " + error,
        });
      });
  }
};

exports.deleteCurve = async (req, res, next) => {
  console.log("deleteCurve");
  console.log(req.params.id);

  const researchCurve = await prisma.top5_curve.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  console.log(researchCurve);
  if (researchCurve) {
    try {
      const deleteDatas = prisma.top5_data
        .deleteMany({
          where: {
            curve_id: researchCurve.id,
          },
        })
        .then(() => {
          console.log("deleteDatas done");
          const deleteCurve = prisma.top5_curve
            .delete({
              where: {
                id: parseInt(req.params.id),
              },
            })
            .then(() => {
              res.status(201).json({
                message: "Curve deleted successfully!",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: "DeleteCurve : " + error,
              });
            });
        })
        .catch(() => console.log("deleteDatas error"));
    } catch (e) {
      console.log("error" + e);
      return res.status(201).json({
        error: "DeleteCurve=>Data : " + e,
      });
    }
  }
};

exports.deleteCurveByIndicator = async (req, res, next) => {
  console.log("deleteCurveByIndicator");

  const researchCurve = await prisma.top5_curve.findMany({
    where: {
      indicator_id: parseInt(req.params.id),
    },
  });
  console.log(researchCurve);
  if (researchCurve) {
    try {
      const deleteDatas = await prisma.top5_data
        .deleteMany({
          where: {
            curve_id: {
              in: researchCurve.map((curve) => curve.id),
            },
          },
        })
        .then(() => console.log("deleteDatas done"))
        .catch(() => console.log("deleteDatas error"));
    } catch (error) {
      console.log("error" + error);
      return res.status(201).json({
        error: "DeleteCurve=>Data : " + error,
      });
    }

    const deleteHistoricalByIndicator = prisma.top5_curve
      .deleteMany({
        where: {
          indicator_id: parseInt(req.params.id),
        },
      })
      .then(async () => {
        console.log("curves deleted");
        res.status(201).json({
          message: "Curves deleted successfully!",
        });
      })
      .catch((error) => {
        console.log("error");
        res.status(400).json({
          error: "DeleteCurves : " + error,
        });
      });
  } else {
    next(new Error("wrongId"));
  }
};

exports.createCurve = async (req, res, next) => {
  console.log("createCurve");
  console.log(req.body);

  let curveName = req.body.name;
  let curveType = req.body.curveType;
  let curveColor = req.body.color;
  let indicatorId = req.body.indicatorId;

  if (
    curveName !== undefined &&
    curveType !== undefined &&
    curveColor !== undefined &&
    indicatorId !== undefined
  ) {
    curveName = curveName.trim();
    curveColor = curveColor.trim();

    const newCurve = await prisma.top5_curve.create({
      data: {
        name: curveName,
        curveType: parseInt(curveType),
        color: curveColor,
        indicator_id: indicatorId,
      },
    });
    console.log("newCurve");

    res.status(201).json({ curve: newCurve });
  } else {
    next(new Error("curveParams not finded"));
  }
};

exports.getOneCurve = (req, res, next) => {
  const curve = prisma.top5_curve
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((curve) => {
      res.status(200).json(curve);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetOneCurve : " + error,
      });
    });
};

exports.getCurvesByIndicator = async (indicatorId, include) => {
  if (include == "true") {
    return await prisma.top5_curve.findMany({
      where: {
        indicator_id: indicatorId,
      },
      include: {
        data: true,
      },
    });
  } else {
    return await prisma.top5_curve.findMany({
      where: {
        indicator_id: indicatorId,
      },
    });
  }
};

exports.getAllCurve = (req, res, next) => {
  const curve = prisma.top5_curve
    .findMany()
    .then((curve) => {
      res.status(201).json(curve);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetAllCurve : " + error,
      });
    });
};
