const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les services
exports.getAllServices = async (req, res, next) => {
    const service = await prisma.service
        .findMany({})
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((error) => {
            res.status(201).json({
                error: "GetAllServices : " + error,
            });
        });
};

// Récupérer un seule service (id)
exports.getOneService = async (req, res, next) => {
    const service = await prisma.service.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (service) => {
            res.status(201).json(service)
        }).catch(
            (error) => {
                res.status(200).json({
                    error: "GetOneService : " + error
                });
            }
        );
};

// Récupérer un seule service (name)
exports.getOneServiceByName = async (req, res, next) => {
    const service = await prisma.service.findUnique({
        where: {
            name: req.params.name
        }
    }).then(
        (service) => {
            res.status(201).json(service)
        }).catch(
            (error) => {
                res.status(201).json({
                    error: "getOneServiceByName : " + error
                })
            }
        )
}

// Créer un service
exports.createService = async (req, res, next) => {
    console.log("createService");

    let serviceName = req.body.name;
    let serviceDescription = req.body.description;
    serviceName = serviceName.trim();
    serviceDescription = serviceDescription.trim();



    const newService = await prisma.service.create({
        data: {
            name: serviceName,
            description: serviceDescription,
        },
    });


    console.log("service added");
    console.log(newService);
    res.status(201).json({ newService: newService });


};

// Modifier un service (id)
exports.updateService = async (req, res, next) => {
    console.log("updateService")

    let serviceName = req.body.name;
    let serviceDescription = req.body.description;

    console.log(req.body)

    const researchService = await prisma.service.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchService) {
        const updateService = await prisma.service.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: serviceName,
                description: serviceDescription,
                updatedAt: new Date()

            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Service updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(201).json({
                        error: 'Update service : ' + error
                    });
                }
            )

        console.log(updateService)
    }
}

// Supprimer un service
exports.deleteService = async (req, res, next) => {
    console.log("deleteService")

    const researchService = await prisma.service.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (researchService) {
        const deleteService = await prisma.service.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })
        res.status(201).json({
            message: 'Service deleted successfully!'
        })
    } else {
        res.status(201).json({
            error: 'Bad Service id'
        })
    }
}
