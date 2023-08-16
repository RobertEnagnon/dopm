const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createAssignationConversation = async (req, res, next) => {
    console.log('createAssignationConversation');

    const { userId } = req;
    const { text } = req.body;
    const { taskId } = req.params;

    prisma.as_task_conversation.create({
        data: {
            text,
            userId: parseInt(userId),
            taskId: parseInt(taskId),
            createdAt: new Date(),
        }
    })
        .then(async newTaskConversation => {
            newTaskConversation = await prisma.as_task_conversation.findUnique({
                where: {
                    id: parseInt(newTaskConversation.id)
                },
                include: {
                    user: true
                }
            })
            res.status(201).json({newTaskConversation});
        })
        .catch(error => {
            res.status(201).json({
                error: `createAssignationConversation : ${error}`
            });
        })
};
