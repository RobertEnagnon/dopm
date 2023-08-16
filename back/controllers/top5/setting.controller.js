const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.altDate = async (req, res, next) => {
    try{
        await prisma.user.update({
            where: {
                id: parseInt(req.body.userId)
            },
            data: {
                isAlterateDate: req.body.alterateDate
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.body.userId)
            }
        })
        res.status(201).json({
            message: 'Setting updated successfully!',
            user: user
        })
    }catch(error){
        console.log("Save setting error", error)
        res.status(400).json({
            error: "Setting : " + error
        })
    }
}