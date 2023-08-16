const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllSugWorkflows = async (req, res, next) => {
  await prisma.sug_workflow
    .findMany({
      include: {
        suggestion: true,
      },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllWorkflows : " + error,
      });
    });
};

exports.createSugWorkflow = async (req, res, next) => {
  const { firstValidated, firstComment, suggestionId, secondComment, secondValidated } = req.body;
  const newSugWorkflow = await prisma.sug_workflow.create({
    data: {
      firstValidated: firstValidated,
      firstComment: firstComment,
      suggestion_id: suggestionId,
      secondComment,
      secondValidated
    },
  });

  if (newSugWorkflow) {
    res.status(201).json({ sugWorkflow: newSugWorkflow });
  } else {
    next(new Error("Data incorrect"));
  }
};

exports.updateSugWorkflow = async (req, res, next) => {
  const stringId = req.params.id;
  const id = parseInt(stringId);
  const { firstValidated, firstComment, secondComment, secondValidated } = req.body;

  const existingSugWorkflow = await prisma.sug_workflow.findUnique({
    where: { id },
  });

  if (existingSugWorkflow) {
    const data = { firstValidated, firstComment, secondComment, secondValidated };

    const updatedSugWorkflow = await prisma.sug_workflow.update({
      where: { id },
      data,
    });

    if (updatedSugWorkflow) {
      res.status(200).json({ sugWorkflow: updatedSugWorkflow });
    } else {
      next(new Error("Data incorrect"));
    }
  } else {
    next(new Error("Suggestion workflow not found"));
  }
};
