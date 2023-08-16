const { PrismaClient } = require("@prisma/client");
const { unlink } = require("fs");
const { nanoid } = require("nanoid");
const prisma = new PrismaClient();

exports.updateIndicator = async (req, res, next) => {
  console.log("updateIndicator", req.body);
  const researchIndicatorById = await prisma.top5_indicator.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (researchIndicatorById) {
    const displayCumulative = req.body.isDisplayCumulative ? 1 : 0;

    await prisma.top5_indicator
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: req.body.name,
          indicatorMode: req.body.indicatorMode,
          orderIndicator: req.body.orderIndicator,
          reading: parseInt(req.body.reading),
          unity: String(req.body.unity),
          responsible: req.body.responsible,
          isDisplayCumulative: displayCumulative,
          indicatorCalculHisto: req.body.indicatorCalculHisto,
          fileType: req.body.fileType,
          fileName: req.body.fileName,
          updatedAt: new Date(),
          range: req.body.range,
          isArchived: req.body.isArchived,
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Post updated successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "UpdateIndicator : " + error,
        });
      });
  }
};

exports.deleteIndicator = async (req, res, next) => {
  console.log("deleteIndicator");
  console.log(req.params.id);
  const researchIndicator = await prisma.top5_indicator.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  console.log(researchIndicator);
  if (researchIndicator) {
    const deleteIndicator = await prisma.top5_indicator
      .delete({
        where: {
          id: parseInt(req.params.id),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Indicator deleted successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "DeleteIndicator : " + error,
        });
      });
  }
};

//exports.deleteIndicatorByCategory = (req, res, next) => {};

exports.uploadIndicatorFile = async (req, res, next) => {
  if (req.files?.file) {
    const file = req.files.file;

    const splitName = file.name.split(".");
    const uniqueId = nanoid();
    const newName = `${uniqueId}.${splitName[splitName.length - 1]}`;

    uploadPathUser = "/files/" + newName;
    uploadPathDisk = process.cwd() + "/public/files/" + newName;

    file.mv(uploadPathDisk, function (err) {
      if (err) {
        next(new Error("Error uploading file"));
      }
    });

    res.status(201).json({ file: uploadPathUser });
  } else {
    next(new Error("File missing"));
  }
};

exports.removedIndicatorFile = async (req, res, next) => {
  if (req.body.fileName) {
    const path = process.cwd() + "/public" + req.body.fileName;
    console.log("path", path);
    unlink(path, (err) => {
      if (err) {
        next(new Error("File not found to delete"));
      }
    });
    res.status(201).json({ message: "File removed" });
  } else {
    res.status(201).json({ error: "File name not given" });
  }
};

exports.createIndicator = async (req, res, next) => {
  const body = req.body;
  const indicatorName = body.name;

  console.log("indicator", body);

  const category = await prisma.top5_category.findUnique({
    where: {
      id: body.categoryId,
    },
  });

  !category && next(new Error("Category not found"));

  const indicatorsSortedByOrder = await prisma.top5_indicator.findMany({
    where: { category_id: category.id },
    orderBy: {
      orderIndicator: "desc",
    },
  });

  indicatorsSortedByOrder[0] === undefined
    ? (orderIndicator = 1)
    : (orderIndicator = indicatorsSortedByOrder[0].orderIndicator + 1);

  const createdIndicator = await prisma.top5_indicator.create({
    data: {
      name: indicatorName,
      orderIndicator: orderIndicator,
      reading: parseInt(body.reading),
      unity: String(body.unity),
      responsible: body.responsible,
      isDisplayCumulative: body.isDisplayCumulative,
      indicatorCalculHisto: body.indicatorCalculHisto,
      category_id: body.categoryId,
      indicatorMode: body.indicatorMode,
      fileType: body.fileType,
      fileName: body.fileName,
      range: body.range,
      ...( body.module && { module: body.module }),
      ...( (body.moduleZoneId && body.moduleZoneId !== "0") ? { moduleZoneId: parseInt(body.moduleZoneId) } : { moduleZoneId: null }),
    },
  });

  !createdIndicator && next(new Error("Category not found"));

  res.status(201).json({ indicator: createdIndicator });
};

exports.getOneIndicator = async (id) => {
  return await prisma.top5_indicator.findUnique({
    where: {
      id: id,
    },
    include: {
      curve: true,
      target: true,
    },
  });
};

exports.getIndicatorsByCategory = async (categoryId) => {
  if (categoryId != undefined && categoryId > 0) {
    return await prisma.top5_indicator.findMany({
      where: {
        category_id: categoryId,
      },
      orderBy: { orderIndicator: "asc" },
    });
  } else {
    return await prisma.top5_indicator.findMany({
      orderBy: { orderIndicator: "asc" },
    });
  }
};

exports.getAllIndicator = async (req, res, next) => {
  const indicator = await prisma.top5_indicator
    .findMany({ orderBy: { orderIndicator: "desc" } })
    .then((indicator) => {
      res.status(201).json(indicator);
    })
    .catch((error) => {
      res.status(400).json({
        error: "GetAllIndicator : " + error,
      });
    });
};

exports.deleteIndicatorByCategory = async (req, res, next) => {
  console.log("deleteIndicatorByCategory");

  const matchedIndicators = await prisma.top5_indicator.findMany({
    where: {
      category_id: parseInt(req.params.id),
    },
  });

  console.log(matchedIndicators);

  if (matchedIndicators) {
    await prisma.top5_indicator
      .deleteMany({
        where: {
          category_id: parseInt(req.params.id),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Indicators deleted successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: "DeleteIndicators : " + error,
        });
      });
  } else {
    next(new Error("Category id does not exist"));
  }
};

exports.downloadFile = async (req, res, next) => {
  console.log("Download File for Indicator");

  const indicator = await prisma.top5_indicator.findUnique({
    where: {
      id: parseInt(req.params.id, 10),
    },
    include: {
      curve: true,
      historical: true,
    },
  });

  if (indicator && indicator.fileName) {
    const fs = require("fs");
    const splitName = indicator.fileName.split(".");
    const newName = `fileToDisplayTop5.${splitName[splitName.length - 1]}`;
    const uploadPathUser = "/files/" + newName;
    const uploadPathDisk = process.cwd() + "/public/files/" + newName;

    fs.copyFile(`${indicator.fileName}`, uploadPathDisk, (err) => {
      if (err) {
        console.log("DownloadFile : " + err);
        res.status(400).json({
          error: "The file requested doesn't exist.",
        });
      } else {
        res.status(200).json({
          file: uploadPathUser,
        });
      }
    });
  } else {
    res.status(400).json({
      error: "The file requested doesn't exist.",
    });
  }
};
