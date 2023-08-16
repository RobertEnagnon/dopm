const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer touts les rightsGroupes
exports.getAllRightsGroupes = async (req, res, next) => {
    console.log("getAllRightsGroupes")

    const rightsGroupes = await prisma.rights_groupes.findMany({
        include: {
            rights_groupes_permissions: true
        }
    })
        .then((result) => {res.status(201).json(result)})
        .catch(
            (error) => {
                res.status(500).json({
                    error: "getAllRightsGroupes : " + error
                });
            }
        );
};

// Récupérer un seul rightsGroupe (id)
exports.getOneRightsGroupe = async (req, res, next) => {
    console.log("getOneRightsGroupes")

    const rightsGroupe = await prisma.rights_groupes.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (rightsGroupe) => {
            res.status(201).json(rightsGroupe)
        }).catch(
        (error) => {
            res.status(500).json({
                error: "getOneRightsGroupe : " + error
            });
        }
    );
};

// Créer un rightsGroupe
exports.createRightsGroupe = async (req, res, next) => {
    console.log("createRightsGroupe")

    const rightsGroupeName = req.body.name.trim();

    const rightsGroupeResearch = await prisma.rights_groupes.findUnique({
        where: {
            name: rightsGroupeName,
        }
    })

    if(!rightsGroupeResearch) {
        const researchOrderRightsGroupe = await prisma.rights_groupes.findMany({})

        console.log(researchOrderRightsGroupe)
        const newRightsGroupe = await prisma.rights_groupes.create({
            data: {
                name: rightsGroupeName
            }
        })
        if(newRightsGroupe) {
            const rightsGroupe = await prisma.rights_groupes.findUnique({
                where: {
                    name: rightsGroupeName,
                }
            })

            console.log("rightsGroupe added")
            console.log(rightsGroupe)
            res.status(201).json({rightsGroupe: rightsGroupe})
        }
    } else {
        res.status(500).json({error: "rightsGroupe name already taken"})
    }
};

// Modifier un rightsGroupe (id)
exports.updateRightsGroupe = async (req, res, next) => {
    console.log("updateRightsGroupe")

    let rightsGroupeName = req.body.name;
    const reseachRightsGroupe = await prisma.rights_groupes.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(reseachRightsGroupe) {
        const updateRightsGroupe = await prisma.rights_groupes.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: rightsGroupeName
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'rightsGroupe updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: 'Update rightsGroupe : ' + error
                    });
                }
            )

        console.log(updateRightsGroupe)
    }
}

// Supprimer un rightsGroupe (id)
exports.deleteRightsGroupe = async (req, res, next) => {
    console.log("deleteRightsGroupe")

    const reseachRightsGroupe = await prisma.rights_groupes.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(reseachRightsGroupe) {
       await prisma.rights_groupes.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })
        res.status(201).json({
            message: 'rightsGroupe deleted successfully!'
        })
    } else {
        res.status(500).json({
            error: 'Bad rightsGroupe id'
        })
    }
}