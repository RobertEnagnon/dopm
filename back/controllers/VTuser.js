const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = (req, res, next) => {
    const user = prisma.users.create({
        data: {
            id: req.body.id,
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            mail: req.body.mail,
            password: req.body.password
        },
    }).then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "CreateUser : " + error
                });
            }).catch(
                (error) => {
                    res.status(400).json({
                        error: "CreateUser : " + error
                    });
                }
            );
};


exports.getOneUser = (req, res, next) => {
    const user = prisma.users.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (user) => {
            res.status(200).json(user)
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "GetOneUser : " + error
                });
            }
        );
};

exports.getAllUsers = (req, res, next) => {
    const user = prisma.users.findMany().then(
        (users) => {
            res.status(200).json(users);
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "GetAllUser : " + error
                });
            }
        );
};

exports.getUserByUsername = async (req, res, next) => {
    return await prisma.users.findUnique({
        where: {
            username: req.body.username,
        }
    })
};