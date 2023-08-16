const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateTarget = async (req, res, next) => {
    console.log("updateTarget")
    console.log(req.params.id);

    const researchtargetById = await prisma.top5_target.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchtargetById) {
        const updateOneTarget = await prisma.top5_target.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: req.body.name,
                target: req.body.target,
                color: req.body.color,
                targetType: parseInt(req.body.targetType),
                targetGoal: parseInt(req.body.targetGoal),
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Post updated successfully!'
                    });
                }).catch(
                    (error) => {
                        res.status(400).json({
                            error: "UpdateCurve : " + error
                        });
                    }
                );
    }
};

exports.deleteTarget = async (req, res, next) => {
    console.log("deleteTarget")
    console.log(req.params.id)

    const researchTarget = await prisma.top5_target.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    console.log(researchTarget)
    if (researchTarget) {
        const deleteTarget = await prisma.top5_target.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Post deleted successfully!'
                    });
                }).catch(
                    (error) => {
                        res.status(400).json({
                            error: "DeleteTarget : " + error
                        });
                    }
                );
    };
};

exports.deleteTargetByIndicator = async (req, res, next) => {
    console.log("deleteTargetByIndicator")

    const researchTarget = await prisma.top5_target.findMany({
        where: {
            indicator_id: parseInt(req.params.id)
        }
    })
    console.log(researchTarget)
    if (researchTarget) {
        const deleteTargetByIndicator = await prisma.top5_target.deleteMany({
            where: {
                indicator_id: parseInt(req.params.id)
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Targets deleted successfully!'
                    });
                }).catch(
                    (error) => {
                        res.status(400).json({
                            error: "DeleteTargets : " + error
                        });
                    }
                );
    } else {
        next(new Error("wrongId"))
    };
};

exports.createTarget = async (req, res, next) => {
    console.log("createTarget")
    console.log(req.body);

    let targetName = req.body.name;
    let target = req.body.target;
    let targetColor = req.body.color;
    let targetType = req.body.targetType;
    let targetGoal = req.body.targetGoal;
    let indicatorId = req.body.indicatorId;

    if (targetName !== undefined && target !== undefined && targetColor !== undefined && targetType !== undefined && targetGoal !== undefined && indicatorId !== undefined) {
        targetName = targetName.trim();
        targetColor = targetColor.trim();

        const createTarget = await prisma.top5_target.create({
            data: {
                name: targetName,
                target: target,
                color: targetColor,
                targetType: parseInt(targetType),
                targetGoal: parseInt(targetGoal),
                indicator_id: indicatorId,
            },
        })
        console.log("createTarget")
        console.log(createTarget)

        res.status(201).json({ target: createTarget })
    } else {
        next(new Error("targetParams not finded"))
    }
};

// exports.getOneTarget = (req, res, next) => {};

exports.getOneTarget = (req, res, next) => {
    const target = prisma.top5_target.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (target) => {
            res.status(200).json(target)
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "GetOneTarget : " + error
                });
            }
        );
};

exports.getTargetsByIndicator = async (indicatorId) => {
    return await prisma.top5_target.findMany({
        where: {
            indicator_id: indicatorId
        }
    });
};


exports.getAllTarget = (req, res, next) => {
    const target = prisma.top5_target.findMany().then(
        (target) => {
            res.status(201).json(target);
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "GetAllTarget : " + error
                });
            }
        );
};
