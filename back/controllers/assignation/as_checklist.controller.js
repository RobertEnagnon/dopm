const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTaskChecklist = async (req, res, next) => {
    console.log('createTaskChecklist');

    const { taskId } = req.params;
    const { label, done } = req.body

    if (!taskId) {
      return res.status(201).json({
        error: `createTaskChecklist : field missing`
      });
    }
    prisma.as_checklist.create({
        data: {
            label: label ?? '',
            done: done ?? 0,
            taskId: parseInt(taskId)
        }
    })
        .then(async newChecklist => {
            const checklist = await prisma.as_checklist.findUnique({
                where: {
                    id: parseInt(newChecklist.id)
                }
            });
            res.status(201).json({newChecklist : checklist});
        })
        .catch(error => {
            res.status(201).json({
                error: `createTaskChecklist : ${error}`
            });
        })
};

exports.updateTaskChecklist = async (req, res, next) => {
    console.log('updateTaskChecklist');

    const { label, done } = req.body;
    const { id, taskId } = req.params

    const researchCategory = await prisma.as_checklist.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!researchCategory) {
      return res.status(201).json({
        error: `updateTaskChecklist : ${error}`
      });
    }

    const updatedChecklist = await prisma.as_checklist.update({
        where: {
            id: parseInt(id)
        },
        data: {
            label: label,
            done: done
        }
    })
        .then(async () => {
            prisma.as_checklist.findUnique({
                where: {
                    id: parseInt(id)
                }
            }).then(() => {
                res.status(201).json({
                    message: 'Checklist updated successfully!'
                });
            }).catch(error => {
                res.status(201).json({
                    error: `updateTaskChecklist : ${error}`
                });
            })
        })
        .catch(error => {
            res.status(201).json({
                error: `updateTaskChecklist : ${error}`
            });
        });
};

exports.deleteTaskChecklist = async (req, res, next) => {
    console.log('deleteTaskChecklist');

    const { id, taskId } = req.params;

    const researchChecklist = await prisma.as_checklist.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchChecklist ) {
        const deleteChecklist = await prisma.as_checklist.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(201).json({
            message: 'Checklist deleted successfully!'
        });
    } else {
        res.status(400).json({
            error: 'Bad id'
        });
    }
}
