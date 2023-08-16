const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer toutes les rightsPermissions
exports.getAllRightsPermissions = async (req, res, next) => {
    console.log("getAllRightsPermissions")

    const rightsPermissions = await prisma.rights_permissions.findMany({})
        .then((result) => {res.status(201).json(result)})
        .catch(
            (error) => {
                res.status(201).json({
                    error: "getAllRightsPermissions : " + error
                });
            }
        );
};

// Récupérer une seule rightsPermission (id)
exports.getOneRightsPermission = async (req, res, next) => {
    console.log("getOneRightsPermissions")

    const rightsPermission = await prisma.rights_permissions.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (rightsPermission) => {
            res.status(201).json(rightsPermission)
        }).catch(
        (error) => {
            res.status(200).json({
                error: "getOneRightsPermission : " + error
            });
        }
    );
};

// Récupérer une seule rightsPermission (name)
exports.getOneRightsPermissionByName = async (req, res, next) => {
    console.log("getOneRightsPermissionByName")

    const rightsPermission = await prisma.rights_permissions.findUnique({
        where: {
            name: req.params.name
        }
    }).then(
        (rightsPermission) => {
            res.status(201).json(rightsPermission)
        }).catch(
        (error) => {
            res.status(201).json({
                error: "getOneRightsPermissionByName : " + error
            })
        }
    )
}

// Créer une rightsPermission
exports.createRightsPermission= async (req, res, next) => {
    console.log("createRightsPermission")

    const rightsPermissionName = req.body.name.trim();

    const rightsPermissionResearch = await prisma.rights_permissions.findUnique({
        where: {
            name: rightsPermissionName,
        }
    })

    if(!rightsPermissionResearch) {
        const researchOrderRightsPermission = await prisma.rights_permissions.findMany({})

        console.log(researchOrderRightsPermission)
        const newRightsPermission = await prisma.rights_permissions.create({
            data: {
                name: rightsPermissionName
            }
        })
        if(newRightsPermission) {
            const rightsPermission = await prisma.rights_permissions.findUnique({
                where: {
                    name: rightsPermissionName,
                }
            })

            console.log("rightsPermission added")
            console.log(rightsPermission)
            res.status(201).json({rightsPermission: rightsPermission})
        }
    } else {
        res.status(201).json({error: "rightsPermission name already taken"})
    }
};

// Modifier une rightsPermission (id)
exports.updateRightsPermission = async (req, res, next) => {
    console.log("updateRightsPermission")

    let rightsPermissionName = req.body.name;
    const reseachRightsPermission = await prisma.rights_permissions.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(reseachRightsPermission) {
        const updateRightsPermission = await prisma.rights_permissions.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: rightsPermissionName
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'rightsPermission updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(201).json({
                        error: 'Update rightsPermission : ' + error
                    });
                }
            )

        console.log(updateRightsPermission)
    }
}

// Supprimer une rightsPermission (id)
exports.deleteRightsPermission = async (req, res, next) => {
    console.log("deleteRightsPermission")

    const reseachRightsPermission = await prisma.rights_permissions.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(reseachRightsPermission) {
        await prisma.rights_permissions.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })
        res.status(201).json({
            message: 'rightsPermission deleted successfully!'
        })
    } else {
        res.status(201).json({
            error: 'Bad rightsPermission id'
        })
    }
}