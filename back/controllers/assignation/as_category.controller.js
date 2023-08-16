const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllAssignationCategories = async (req, res, next) => {
    console.log('getAllAssignationCategories');
    const { asBoardId } = req.query;

    const category = await prisma.as_categories
        .findMany({
            where: {
              asBoardId: parseInt(asBoardId)
            },
            orderBy: [{ createdAt:'asc' }],
        })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(error => {
            res.status(400).json({
                error: `getAllAssignationCategories : ${error}`
            });
        });
};

exports.getOneAssignationCategory = async (req, res, next) => {
    console.log('getOneAssignationCategory');

    const { id } = req.params;

    const category = await prisma.as_categories
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
                error: `getOneAssignationCategory : ${error}`
            });
        });
};

exports.createAssignationCategories = async (req, res, next) => {
    console.log('createAssignationCategories');

    const { name, color, user, asBoardId } = req.body;

    if( name && color ) {
        prisma.as_categories.create({
            data: {
                name: name,
                color: color,
                description: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: user?.id?.toString(),
                updatedBy: user?.id?.toString(),
                asBoardId: parseInt(asBoardId)
            }
        })
            .then(async newCategory => {
                const category = await prisma.as_categories.findUnique({
                    where: {
                        id: parseInt(newCategory.id)
                    }
                });
                res.status(201).json({newASCategory : category});
            })
            .catch(error => {
                res.status(201).json({
                    error: `createAssignationCategories : ${error}`
                });
            })
    } else if( !name ) {
        console.log(`createAssignationCategories : No Name Provided`)
        res.status(200).json({
            error: `No Name Provided`
        });
    } else if( !color ) {
        console.log(`createAssignationCategories : No Color Provided`)
        res.status(200).json({
            error: `No Color Provided`
        });
    }
};

exports.updateAssignationCategories = async (req, res, next) => {
    console.log('updateAssignationCategories');

    const { id } = req.params;
    const { name, color, user } = req.body;

    const researchCategory = await prisma.as_categories.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchCategory ) {
        const updatedCategory = await prisma.as_categories.update({
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
                prisma.as_categories.findUnique({
                    where: {
                        id: parseInt(id)
                    }
                }).then(newCategory => {
                    res.status(201).json({
                        message: 'Assignation category updated successfully!'
                    });
                }).catch(error => {
                    res.status(201).json({
                        error: `updateAssignationCategories : ${error}`
                    });
                })
            })
            .catch(error => {
                res.status(201).json({
                    error: `updateAssignationCategories : ${error}`
                });
            });
    }
};

exports.deleteAssignationCategories = async (req, res, next) => {
    console.log('deleteAssignationCategories');

    const { id } = req.params;

    const researchCategory = await prisma.as_categories.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchCategory ) {
        const deleteCategory = await prisma.as_categories.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(201).json({
            message: 'Assignation category deleted successfully!'
        });
    } else {
        res.status(400).json({
            error: 'Bad id'
        });
    }
}
