const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTaskResponsible = async (req, res, next) => {
    console.log('createTaskResponsible');

    const { userId } = req.body;
    const { taskId } = req.params;

    if (!userId || !taskId) {
      return res.status(201).json({
        error: `createTaskResponsible : field missing`
      });
    }

    prisma.as_responsible.create({
        data: {
            taskId: taskId,
            userId: userId
        }
    })
        .then(async newresponsible => {
            const responsible = await prisma.as_responsible.findUnique({
                where: {
                    id: parseInt(newresponsible.id)
                }
            });
            res.status(201).json({newresponsible : responsible});
        })
        .catch(error => {
            res.status(201).json({
                error: `createTaskResponsible : ${error}`
            });
        })
};

exports.deleteTaskResponsible = async (req, res, next) => {
    console.log('deleteTaskResponsible');

    const { id, taskId } = req.params;

    const researchresponsible = await prisma.as_responsible.findUnique({
        where: {
            id: parseInt(id),
            taskId: parseInt(taskId)
        }
    });
    if( researchresponsible ) {
        const deleteresponsible = await prisma.as_responsible.delete({
            where: {
                id: parseInt(id),
                taskId: parseInt(taskId)
            }
        });
        res.status(201).json({
            message: 'Responsible deleted successfully!'
        });
    } else {
        res.status(400).json({
            error: 'Bad id'
        });
    }
}
