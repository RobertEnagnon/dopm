const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllAuditCategories = async (req, res, next) => {
    console.log('getAllAuditCategories');

    const audit = await prisma.at_category
        .findMany({
            orderBy: [{ createdAt:'asc' }],
        })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(error => {
            res.status(400).json({
                error: `getAllAuditCategories : ${error}`
            });
        });
};

exports.getOneAuditCategory = async (req, res, next) => {
    console.log('getOneAuditCategory');

    const { id } = req.params;

    const audit = await prisma.at_category
        .findUnique({
            where: {
                id: parseInt(id, 10)
            }
        })
        .then(category => {
            res.status(201).json(category);
        })
        .catch(error => {
            res.status(200).json({
                error: `getOneAuditCategory : ${error}`
            });
        });
};

exports.createAuditCategories = async (req, res, next) => {
    console.log('createAuditCategories');

    const { name, color, user } = req.body;

    if( name && color ) {
        prisma.at_category.create({
            data: {
                name: name,
                color: color,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: user?.id?.toString(),
                updatedBy: user?.id?.toString(),
            }
        })
            .then(async newCategory => {
                const category = await prisma.at_category.findUnique({
                    where: {
                        id: parseInt(newCategory.id)
                    }
                });
                res.status(201).json({newATCategory : category});
            })
            .catch(error => {
                res.status(201).json({
                    error: `createAuditCategories : ${error}`
                });
            })
    } else if( !name ) {
        console.log(`createAuditCategories : No Name Provided`)
        res.status(200).json({
            error: `No Name Provided`
        });
    } else if( !color ) {
        console.log(`createAuditCategories : No Color Provided`)
        res.status(200).json({
            error: `No Color Provided`
        });
    }
};

exports.updateAuditCategories = async (req, res, next) => {
    console.log('updateAuditCategories');

    const { id } = req.params;
    const { name, color, user } = req.body;

    const researchCategory = await prisma.at_category.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchCategory ) {
        const updatedCategory = await prisma.at_category.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name,
                color: color,
                updatedAt: new Date(),
                updatedBy: user?.id?.toString(),
            }
        })
            .then(async () => {
                prisma.at_category.findUnique({
                    where: {
                        id: parseInt(id)
                    }
                }).then(newCategory => {
                    res.status(201).json({
                        message: 'Audit category updated successfully!'
                    });
                }).catch(error => {
                    res.status(201).json({
                        error: `updateAuditCategories : ${error}`
                    });
                })
            })
            .catch(error => {
                res.status(201).json({
                    error: `updateAuditCategories : ${error}`
                });
            });
    }
};

exports.deleteAuditCategories = async (req, res, next) => {
    console.log('deleteAuditCategories');

    const { id } = req.params;

    const researchCategory = await prisma.at_category.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchCategory ) {
        const deleteCategory = await prisma.at_category.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(201).json({
            message: 'Audit category deleted successfully!'
        });
    } else {
        res.status(400).json({
            error: 'Bad id'
        });
    }
}
