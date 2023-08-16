const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getOneData = async (req, res, next) => {
  const data = await prisma.top5_data
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetOneData : " + error,
      });
    });
};

exports.getDatasByCurve = async (curveId, date) => {
  if (curveId !== undefined && curveId > 0 && date !== undefined) {
    return await prisma.top5_data.findMany({
      where: {
        curve_id: parseInt(curveId, 10),
        date: {
          contains: date,
        },
      },
    });
  } else {
    return await prisma.top5_data.findMany();
  }
};

exports.getAllData = async (req, res, next) => {
  const data = await prisma.top5_data
    .findMany()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetAllData : " + error,
      });
    });
};

exports.updateData = async (req, res, next) => {
  let id = req.params.id;
  let date = req.body.date;
  let data = req.body.data;
  let comment = req.body.comment;

  if (date !== undefined && data !== undefined) {
    date = date.trim();

    const selectData = await prisma.top5_data.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    console.log(selectData);
    if (selectData != undefined) {
      const updateData = await prisma.top5_data.update({
        where: { id: parseInt(id) },
        data: {
          date: date,
          data: data,
          comment: comment,
        },
      });
      res.status(201).json(true);
    } else {
      next(new Error("wrongId"));
    }
  } else {
    next(new Error("date or data is null"));
  }
};

exports.deleteData = async (req, res, next) => {
  console.log("deleteData");
  console.log(req.params.id);
  const researchData = await prisma.top5_data.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  console.log(researchData);
  if (researchData) {
    const deleteData = await prisma.top5_data
      .delete({
        where: {
          id: parseInt(req.params.id),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Post deleted successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "DeleteData : " + error,
        });
      });
  }
};

exports.deleteDataByCurve = async (req, res, next) => {
  console.log("deleteDataByCurve");

  const researchData = await prisma.top5_data.findMany({
    where: {
      curve_id: parseInt(req.params.id),
    },
  });
  console.log(researchData);
  if (researchData) {
    const deleteDataByCurve = await prisma.top5_data
      .deleteMany({
        where: {
          curve_id: parseInt(req.params.id),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Datas deleted successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "DeleteDatas : " + error,
        });
      });
  } else {
    next(new Error("wrongId"));
  }
};

exports.createCurve = (req, res, next) => {
  console.log("createCurve");
  const curve = prisma.top5_curve
    .create({
      data: {
        name: req.body.name,
        curveType: req.body.curveType,
        color: req.body.color,
        indicator_id: req.body.indicator_id,
      },
    })
    .then(() => {
      res.status(201).json({
        message: "Curve created successfully!",
        data: curve,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: "CreateCurve : " + error,
      });
    });
};

exports.createData = async (req, res, next) => {
  console.log("createData");
  let date = req.body.date;
  let data = req.body.data;
  let comment = req.body.comment;
  let curveId = req.body.curveId;

  if (date != undefined && curveId !== undefined) {
    date = date.trim();
    data = data.trim();
    comment = comment.trim();

    const researchData = await prisma.top5_data.findMany({
      where: {
        curve_id: parseInt(curveId),
        date: date,
        data: data,
        comment: comment,
      },
    });

    if (researchData?.length > 0) {
      res.status(400).json({
        error: "Data already exist",
      });
      return;
    }

    const createData = await prisma.top5_data
      .create({
        data: {
          date: date,
          data: data,
          comment: comment,
          curve_id: curveId,
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Post saved successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "CreateData : " + error,
        });
      });
  } else {
    next(new Error("noNameValue"));
  }
};
