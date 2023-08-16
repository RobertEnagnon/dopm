const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllBoards = async (req, res) => {
  const dashboardId = parseInt(req.query.dashboardId);

  if (!dashboardId) {
    return [];
  }

  const boards = await prisma.boardtuile.findMany({
    select: {
      id: true,
      i: true,
      branche: true,
      category: true,
      format: true,
      h: true,
      indicator_id: true,
      isBounded: true,
      isDraggable: true,
      isResizable: true,
      maxH: true,
      maxW: true,
      minH: true,
      minW: true,
      moved: true,
      periode: true,
      static: true,
      tool: true,
      type: true,
      w: true,
      x: true,
      y: true,
      user: true,
      size: true,
      indicator: {
        include: {
          curve: true,
          target: true,
          historical: true
        }
      }
    },
    where: {
      dashboard_id: dashboardId
    }
  });
  return boards
};
exports.createBoard = async (req, res) => {
  if (req.userId) {
    const newBoard = await prisma.boardtuile.create({
      data: { ...req.body, userId: req.userId },
    });
    if (newBoard) {
      return res.status(201).json(newBoard);
    }
    return res.status(400).json({ error: "Bad Request" });
  }
  return res.status(401).json({ error: "Unauthorized" });
  //   console.log(newBoard);
};
exports.updateManyBoards = async (boards, userId, dashboardId) => {
  if (boards?.length > 0) {

    const updatePromises = await boards.map((board) => {
      delete board.indicator
      delete board.fiches

      if (board.id) {
        return prisma.boardtuile.update({
          where: { id: board.id },
          data: { ...board, user: userId },
        });
      } else {
        return prisma.boardtuile.create({
          data: { ...board, user: userId, dashboard_id: dashboardId },
        });
      }
    });
    await Promise.all(updatePromises);
  }
  return await prisma.boardtuile.findMany({
    where: {
      dashboard_id: dashboardId
    }
  });
};
exports.deleteBoard = async (req, res) => {
  const board = await prisma.boardtuile.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  {
    console.log(board.user)
    if (req.userId !== board.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const deleted = await prisma.boardtuile.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (deleted) {
      console.log("deleted", deleted);
      return res.status(200).json({ message: "Board deleted" });
    }
  }
  return res.status(400).json({ error: "Bad Request" });
};
