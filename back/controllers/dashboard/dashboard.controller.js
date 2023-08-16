const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer tous les dashboards
exports.getAllDashboards = async (req, res, next) => {
    const dashboards = await prisma.dashboard.findMany({
        orderBy: {
            order: 'asc',
        }
    })
        .then((result) => { res.status(201).json(result) })
        .catch(
            (error) => {
                res.status(201).json({
                    error: "GetAllDashboard : " + error
                });
            }
        );
};

// Récupérer un seul dashboard (id)
exports.getOneDashboard = async (req, res, next) => {
    const dashboard = await prisma.dashboard.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (dashboard) => {
            res.status(201).json(dashboard)
        }).catch(
            (error) => {
                res.status(200).json({
                    error: "GetOneDashboard : " + error
                });
            }
        );
};

// Créer une branche
exports.createDashboard = async (req, res, next) => {
    let dashboardName = req.body.name.trim();
    let dashboardOrder;

    const researchOrderBranch = await prisma.dashboard.findMany({
        orderBy: {
            order: "desc"
        }
    })

    if (researchOrderBranch[0] === undefined)
        dashboardOrder = 1
    else
        dashboardOrder = researchOrderBranch[0].order + 1;

    const newDashboard = await prisma.dashboard.create({
        data: {
            name: dashboardName,
            order: dashboardOrder,
        },
    })
    res.status(201).json({ newDashboard: newDashboard })
};

// Modifier un dashboard (id)
exports.updateDashboard = async (req, res, next) => {
    let dashboardName = req.body.name.trim();
    let dashboardOrder = parseInt(req.body.order);

    const researchDashboard = await prisma.dashboard.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchDashboard) {
        const updateDashboard = await prisma.dashboard.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: dashboardName,
                order: dashboardOrder
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Dashboard updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(201).json({
                        error: 'Update dashboard : ' + error
                    });
                }
            )

    }
}

// Supprimer un dashboard (id)
exports.deleteDashboard = async (req, res, next) => {
    const researchDashboard = await prisma.dashboard.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchDashboard) {
        const deleteDashboard = await prisma.dashboard.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })
        const deleteBoards = await prisma.boardtuile.deleteMany({
            where: {
                dashboard_id: parseInt(req.params.id)
            }
        })
        res.status(201).json({
            message: 'Dashboard deleted successfully!'
        })
    } else {
        res.status(201).json({
            error: 'Bad dashboard id'
        })
    }
}