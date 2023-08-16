const { PrismaClient } = require('@prisma/client');
const fs = require('fs')
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res, next) => {
    console.log('getAllTask');

    const { tableId } = req.params;

    if( tableId ) {
        const tasks = await prisma.as_tasks
            .findMany({
                where: {
                    tableId: parseInt(tableId),
                    archived: 0
                },
                orderBy: [{ orderTask: 'asc' }],
                include: {
                    table: true,
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
            })
            .then(async result => {
                result = await formatTaskResponsibles(result)
                res.status(201).json(result);
            })
            .catch(error => {
                res.status(400).json({
                    error: `getAllTasks : ${error}`
                });
            });
    } else {
        const tasks = await prisma.as_tasks
            .findMany({
                where: {
                    archived: 0
                },
                orderBy: [{ orderTask: 'asc' }],
                include: {
                    table: true,
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
            })
            .then(async result => {
                result = await formatTaskResponsibles(result)
                res.status(201).json(result);
            })
            .catch(error => {
                res.status(400).json({
                    error: `getAllTasks : ${error}`
                });
            });
    }
};

exports.createTask = async (req, res, next) => {
    console.log('createTask');

    const {
        title,
        description,
        remain,
        estimation,
        tableId,
        categoryId,
        orderTask,
        responsibles,
        checklist,
        files
    } = req.body;
    if( title && tableId && categoryId ) {
        prisma.as_tasks.create({
            data: {
                title: title,
                description: description ?? '',
                remain: remain ?? '',
                estimation: estimation ?? '',
                tableId: parseInt(tableId),
                categoryId: parseInt(categoryId),
                orderTask: orderTask
            }
        })
        .then(async newTask => {
            await responsibles.map(async responsible =>
              await prisma.as_responsible.create({
                data: {
                  taskId: newTask.id,
                  userId: parseInt(typeof responsible === "string" ? responsible : responsible.id)
                }
              })
            )
            await checklist?.map(async c =>
                await prisma.as_checklist.create({
                    data: {
                        label: c.label,
                        done: c.done,
                        taskId: newTask.id
                    }
                })
            )
            await files?.map(async file => {
                const filename = Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1) + file.path.split('\\').pop().split('/').pop()
                const uploadPathToSave = "/images/asFile/" + filename
                fs.copyFile(process.cwd() + "/public" + file.path, process.cwd() + "/public" + uploadPathToSave, (err) => {
                    if (err) throw err;
                })
                return await prisma.as_file.create({
                    data: {
                        label: file.label,
                        path: uploadPathToSave,
                        taskId: newTask.id
                    }
                })
            })
            let task = await prisma.as_tasks.findUnique({
                where: {
                    id: parseInt(newTask.id)
                },
                include: {
                    table: true,
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
            });
            task = await formatTaskResponsibles(task)
            res.status(201).json({ newASTask : task });
        })
        .catch(error => {
            res.status(201).json({
                error: `createASTask : ${error}`
            })
        })
    } else if( !title ) {
        console.log('createTask : No title provided');
        res.status(200).json({
            error: 'No title provided'
        })
    } else if( !tableId ) {
        console.log('createTask : No table provided');
        res.status(200).json({
            error: 'No table provided'
        })
    } else if( !categoryId ) {
        console.log('createTask : No category provided');
        res.status(200).json({
            error: 'No category provided'
        })
    }
}

exports.reorderTasks = async (req, res, next) => {
    console.log('reorderTasks')

    const { tasks } = req.body;
    if( tasks ) {
        for( const task of tasks ) {
            const index = tasks.indexOf(task);
            const researchTask = await prisma.as_tasks.findUnique({
                where: {
                    id: task.id
                }
            });
            if( researchTask ) {
                const updatedTask = await prisma.as_tasks.update({
                    where: {
                        id: task.id
                    },
                    data: {
                        orderTask: index+1,
                        tableId: task.tableId
                    }
                })
            }
        }

        prisma.as_tasks.findMany({
            orderBy: [{ orderTask: 'asc' }],
            include: {
                table: true,
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
        })
        .then(async result => {
            result = await formatTaskResponsibles(result)
            res.status(201).json(result);
        })
        .catch(error => {
            res.status(400).json({
                error: `reorderTask : ${error}`
            })
        })
    } else if( !tasks ) {
        console.log(`reorderTasks : No table to reorder`);
        res.status(200).json({
            error: 'No tasks to reorder'
        })
    }
}

exports.updateTask = async (req, res, next) => {
    console.log('updateASTask');

    const { id } = req.params;
    const {
        title,
        description,
        remain,
        estimation,
        tableId,
        categoryId,
        orderTask,
        responsibles,
        archived
    } = req.body;

    if( title && tableId && categoryId ) {
        const researchTask = await prisma.as_tasks.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if( researchTask ) {
            const updatedTask = await prisma.as_tasks.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    title: title,
                    description: description ?? '',
                    remain: remain ?? '',
                    estimation: estimation ?? '',
                    tableId: tableId,
                    categoryId: categoryId,
                    orderTask: orderTask,
                    archived: archived,
                    ...( archived === 1 && researchTask.archived === 0 ? { archivedAt: new Date() } : {})
                }
            })
            .then(async () => {
                await prisma.as_responsible.deleteMany({
                    where: {
                        taskId: parseInt(id)
                    }
                })
                await prisma.as_responsible.createMany({
                    data: responsibles.map(responsible => {
                        if (typeof responsible === "string") {
                            return {
                                taskId: parseInt(id),
                                userId: parseInt(responsible)
                            }
                        } else {
                            return {
                                taskId: parseInt(id),
                                userId: parseInt(responsible.id)
                            }
                        }

                    })
                })
                prisma.as_tasks.findUnique({
                    where: {
                        id: parseInt(id)
                    },
                    include: {
                        table: true,
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
                })
                .then(async newTask => {
                    newTask = await formatTaskResponsibles(newTask)
                    res.status(201).json({
                        message: 'Task updated successfully',
                        newTask
                    });
                })
                .catch(error => {
                    res.status(201).json({
                        error: `updatedASTask : ${error}`
                    })
                })
            })
        }
    } else if( !title ) {
        console.log('createTask : No title provided');
        res.status(200).json({
            error: 'No title provided'
        })
    } else if( !tableId ) {
        console.log('createTask : No table provided');
        res.status(200).json({
            error: 'No table provided'
        })
    } else if( !categoryId ) {
        console.log('createTask : No category provided');
        res.status(200).json({
            error: 'No category provided'
        })
    }
}

exports.deleteTask = async (req, res, next) => {
    console.log('deleteASTask');

    const { id } = req.params;

    const researchTask = await prisma.as_tasks.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchTask ) {
        const deleteTask = await prisma.as_tasks.delete({
            where: {
                id: parseInt(id)
            }
        });
        await prisma.AS_responsible.deleteMany({
            where: {
                taskId: parseInt(id)
            }
        });
        const files = await prisma.as_file.findMany({
            where: {
                taskId: parseInt(id)
            }
        });
        await files.map(async file => fs.unlinkSync(process.cwd() + "/public" + file.path))
        await prisma.as_file.deleteMany({
            where: {
                taskId: parseInt(id)
            }
        });
        await prisma.as_checklist.deleteMany({
            where: {
                taskId: parseInt(id)
            }
        });
        res.status(201).json({
            message: 'Task deleted successfully!'
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
