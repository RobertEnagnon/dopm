const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer toutes les braches
exports.getAllBranch = async (req, res, next) => {
    const branch = await prisma.top5_branch.findMany({
        orderBy: {
            orderBranch: 'asc',
        }
    })
        .then((result) => { res.status(201).json(result) })
        .catch(
            (error) => {
                res.status(201).json({
                    error: "GetAllBranch : " + error
                });
            }
        );
};

// Récupérer une seule branche (id)
exports.getOneBranch = async (req, res, next) => {
    const branch = await prisma.top5_branch.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (branch) => {
            res.status(201).json(branch)
        }).catch(
            (error) => {
                res.status(200).json({
                    error: "GetOneBranch : " + error
                });
            }
        );
};

// Récupérer une seule branche (name)
exports.getOneBranchByName = async (req, res, next) => {
    const branch = await prisma.top5_branch.findUnique({
        where: {
            name: req.params.name
        }
    }).then(
        (branch) => {
            res.status(201).json(branch)
        }).catch(
            (error) => {
                res.status(201).json({
                    error: "getOneBranchByName : " + error
                })
            }
        )
}

// Créer une branche
exports.createBranch = async (req, res, next) => {
    let branchName = req.body.name;
    branchName = branchName.trim();

    const branchResearch = await prisma.top5_branch.findUnique({
        where: {
            name: branchName,
        }
    })

    if (!branchResearch) {
        const researchOrderBranch = await prisma.top5_branch.findMany({
            orderBy: {
                orderBranch: "desc"
            }
        })

        if (researchOrderBranch[0] === undefined)
            orderBranch = 1
        else
            orderBranch = researchOrderBranch[0].orderBranch + 1;

        const newBranch = await prisma.top5_branch.create({
            data: {
                name: branchName,
                orderBranch: orderBranch,
            },
        })
        if (newBranch) {
            const branch = await prisma.top5_branch.findUnique({
                where: {
                    name: branchName,
                }
            })

            console.log("branch added")
            res.status(201).json({ branch: branch })
        }
    } else {
        res.status(201).json({ error: "Branch name already taken" })
    }
};

// Modifier une branche (id)
exports.updateBranch = async (req, res, next) => {
    console.log("updateBranch")

    let branchName = req.body.name;
    let orderBranch = parseInt(req.body.orderBranch);

    console.log(req.body)

    const researchBranch = await prisma.top5_branch.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchBranch) {
        const updateBranch = await prisma.top5_branch.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: branchName,
                orderBranch: orderBranch
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Branch updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(201).json({
                        error: 'Update branch : ' + error
                    });
                }
            )

    }
}

// Supprimer une branche (id)
exports.deleteBranch = async (req, res, next) => {
    console.log("deleteBranch")

    const researchBranch = await prisma.top5_branch.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchBranch) {
        const deleteBranch = await prisma.top5_branch.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })
        res.status(201).json({
            message: 'Branch deleted successfully!'
        })
    } else {
        res.status(201).json({
            error: 'Bad branch id'
        })
    }
}