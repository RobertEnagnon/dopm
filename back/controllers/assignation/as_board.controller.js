const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllASBoards = async (req, res, next) => {
    prisma.as_board.findMany({
        orderBy: {
            order: 'asc',
        }
    })
        .then((result) => { res.status(201).json(result) })
        .catch(
            (error) => {
                res.status(201).json({
                    error: "getAllASBoards : " + error
                });
            }
        );
};

exports.getOneASBoard = async (req, res, next) => {
    await prisma.as_board.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (asBoard) => {
            res.status(201).json(asBoard)
        }).catch(
            (error) => {
                res.status(200).json({
                    error: "getOneASBoard : " + error
                });
            }
        );
};

exports.createASBoard = async (req, res, next) => {
    let asBoardName = req.body.name.trim();
    let asBoardOrder;

    const researchOrderAsBoard = await prisma.as_board.findMany({
        orderBy: {
            order: "desc"
        }
    })

    if (researchOrderAsBoard[0] === undefined)
      asBoardOrder = 1
    else
      asBoardOrder = researchOrderAsBoard[0].order + 1;

    const newAsBoard = await prisma.as_board.create({
        data: {
            name: asBoardName,
            order: asBoardOrder,
        },
    })
    res.status(201).json({ newAsBoard: newAsBoard })
};

exports.updateASBoard = async (req, res, next) => {
    let asBoardName = req.body.name.trim();
    let asBoardOrder = parseInt(req.body.order);

    const researchAsBoard = await prisma.as_board.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchAsBoard) {
        await prisma.as_board.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: asBoardName,
                order: asBoardOrder
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'asBoard updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(201).json({
                        error: 'Update asBoard : ' + error
                    });
                }
            )

    }
}

exports.deleteASBoard = async (req, res, next) => {
    const researchAsBoard = await prisma.as_board.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchAsBoard) {
        await prisma.as_board.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })
        await prisma.as_tables.deleteMany({
            where: {
                asBoardId: parseInt(req.params.id)
            }
        })
        res.status(201).json({
            message: 'AsBoard deleted successfully!'
        })
    } else {
        res.status(201).json({
            error: 'Bad AsBoard id'
        })
    }
}