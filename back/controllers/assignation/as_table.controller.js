const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTables = async (req, res, next) => {
    console.log('getAllTables');

    const archived = parseInt(req.query.archived);
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const asBoardId = parseInt(req.query.asBoardId);
    // month - 1 because months are based from 0 to 11.
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);

    const tables = await prisma.as_tables
        .findMany({
            where: {
                asBoardId: asBoardId
            },
            orderBy: [{ orderTable: 'asc' }],
            include: {
                tasks: {
                    orderBy: {
                        orderTask: 'asc'
                    },
                    include: {
                        checklist: true,
                        files: true,
                        responsibles: true,
                        category: true,
                        conversation: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            include: {
                                user: true
                            }
                        }
                    },
                    where: {
                        AND: [
                            { archived: archived },
                            {
                                ...(archived === 1 ? {
                                    archivedAt: {
                                        gte: firstDate,
                                        lte: lastDate,
                                    }
                                } : {})
                            }
                        ]
                    }
                }
            }
        })
        .then(async tables => {
            const result = []
            for (let i = 0; i < tables.length; i++) {
                const table = tables[i]
                for (let j = 0; j < table.tasks.length; j++) {
                    table.tasks[j] = await formatTaskResponsibles(table.tasks[j])
                }
                result.push(table)
            }
            res.status(201).json(result)
        })
        .catch(error => {
            res.status(400).json({
                error: `getAllTables : ${error}`
            });
        });
};

exports.createTable = async (req, res, next) => {
    console.log('createTable');

    const { name, description, color, orderTable, user, asBoardId } = req.body;
    if( name ) {
        prisma.as_tables.create({
            data: {
                name: name,
                description: description ?? '',
                orderTable: orderTable,
                color: color ?? '',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: user?.id?.toString(),
                updatedBy: user?.id?.toString(),
                asBoardId: parseInt(asBoardId)
            }
        })
        .then(async newTable => {
            const table = await prisma.as_tables.findUnique({
                where: {
                    id: parseInt(newTable.id)
                },
                include: {
                    tasks: {
                        orderBy: {
                            orderTask: 'asc'
                        },
                        include: {
                            checklist: true,
                            files: true,
                            responsibles: true,
                            category: true,
                            conversation: {
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                include: {
                                    user: true
                                }
                            }
                        },
                        where: {
                            archived: 0
                        }
                    }
                }
            });
            res.status(201).json({ newASTable : table });
        })
        .catch(error => {
            res.status(201).json({
                error: `createASTable : ${error}`
            })
        })
    } else if( !name ) {
        console.log(`createASTable : No name provided`);
        res.status(200).json({
            error: 'No name provided'
        })
    }
}

exports.updateTable = async (req, res, next) => {
    console.log('updateTable');

    const { id } = req.params;
    const { name, description, color, user } = req.body;
    if( name ) {
        const researchTable = await prisma.as_tables.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if( researchTable ) {
            const updatedTable = await prisma.as_tables.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name: name,
                    description: description,
                    color: color,
                    updatedAt: new Date(),
                    updatedBy: user?.id?.toString()
                }
            })
            .then(async () => {
                prisma.as_tables.findUnique({
                    where: {
                        id: parseInt(id)
                    },
                    include: {
                        tasks: {
                            orderBy: {
                                orderTask: 'asc'
                            },
                            include: {
                                checklist: true,
                                files: true,
                                responsibles: true,
                                category: true,
                                conversation: {
                                    orderBy: {
                                        createdAt: 'desc'
                                    },
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                })
                .then(newTable => {
                    res.status(201).json({
                        message: 'Table updated successfully'
                    });
                })
                .catch(error => {
                    res.status(201).json({
                        error: `updatedASTable : ${error}`
                    })
                })
            })
        }
    } else if( !name ) {
        console.log(`updateASTable : No name provided`);
        res.status(200).json({
            error: 'No name provided'
        })
    }
}

exports.reorderTables = async (req, res, next) => {
    console.log('reorderTables')

    const { tables } = req.body;
    if( tables ) {
        for (const table of tables) {
            const index = tables.indexOf(table);
            const researchTable = await prisma.as_tables.findUnique({
                where: {
                    id: table.id
                }
            });
            if( researchTable ) {
                const updatedTable = await prisma.as_tables.update({
                    where: {
                        id: table.id
                    },
                    data: {
                        orderTable: index+1
                    }
                })
            }
        }
        res.status(201).json({message: 'Update successfully'})
    } else if( !tables ) {
        console.log(`reorderTables : No table to reorder`);
        res.status(200).json({
            error: 'No table to reorder'
        })
    }
}

exports.deleteTable = async (req, res, next) => {
    console.log('deleteASTables');

    const { id } = req.params;

    const researchTable = await prisma.as_tables.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchTable ) {
        const deleteTable = await prisma.as_tables.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(201).json({
            message: 'Table deleted successfully!'
        });
    } else {
        res.status(400).json({
            error: 'Bad id'
        });
    }
}

const formatTaskResponsibles = async (tasks) => {

    const getResponsibles = async (responsibles) => {
        return (await prisma.user.findMany({
            where: {
                id: { in : responsibles.map(r => r.userId)}
            }
        })).map(resp => ({ ...resp, lastname: resp.last_name, firstname: resp.first_name, function: resp.fonction }))
    }

    if (!Array.isArray(tasks)) {
        tasks.responsibles = await getResponsibles(tasks.responsibles)
        return tasks
    }
    return await tasks.map(async task => {
        task.responsibles = await getResponsibles(task.responsibles)
        return task
    })
}
