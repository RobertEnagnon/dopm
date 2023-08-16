const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.getConnection = async () => {
    return prisma.connection_ad.findMany({
        orderBy: [{
            updatedAt: 'desc'
        }],
        take: 1
    });
}

exports.getEnableConnection = async () => {
    return prisma.connection_ad.findMany({
        where: {
            disable: false
        },
        orderBy: [{
            updatedAt: 'desc'
        }],
        take: 1
    });
}

exports.createConnection = (req, res, next) => {

    const { login_url, logout_url, certificat, disable } = req.body;

    prisma.connection_ad.create({
        data: {
            login_url: login_url,
            logout_url: logout_url,
            certificat: certificat,
            disable: disable
        },
    }).then(
        (connection) => {
            res.status(201).json({
                message: 'Connection saved successfully!',
                connection
            });
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "Create connection : " + error
                });
            }
        );
}

exports.modifyConnection = (req, res, next) => {
    const { login_url, logout_url, certificat, disable } = req.body;
    const { id } = req.params;

    prisma.connection_ad.update({
        where: { id: parseInt(id) },
        data: {
            login_url: login_url,
            logout_url: logout_url,
            certificat: certificat,
            disable: disable
        },
    }).then(
        () => {
            res.status(200).json({
                message: 'Connection updated successfully!'
            });
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "Updated connection : " + error
                });
            }
        );
}

exports.deleteConnection = (req, res, next) => {
    const { id } = req.params;

    prisma.connection_ad.delete({
        where: { id: parseInt(id) }
    }).then(
        () => {
            res.status(200).json({
                message: 'Connection deleted successfully!'
            });
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "Deleted connection : " + error
                });
            }
        );
}

exports.generateToken = (id) => {
    return jwt.sign({ id }, config.secret, {
        // 24 hours
        expiresIn: '24h'
        // 5 secondes
        //expiresIn: 10
    });
}

exports.verifyExistence = async (email) => {

    const userByUsername = await prisma.user.findUnique({
        where: {
            username: email,
        }
    });
    const userByEmail = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    return userByUsername ? userByUsername : userByEmail;
}

exports.getUserInformations = async (id) => {

    return await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            permissions: true,
            language: {
                include: {
                    language: true
                }
            },
            groupes: true,
            role: {
                include: {
                    role: true
                }
            }
        }
    });
}

exports.handlePermissions = async (id) => {

    // Gestion des droits :
    const permissions = await prisma.rights_permissions.findMany({
        include: {
            rights_groupes_permissions: true,
            rights_user_permissions: true
        }
    })
    const userGroupes = await prisma.rights_user_groupes.findMany({
        where: {
            id_user: id
        }
    })

    let permissionIdProv = new Date().getTime()
    const userPermissions = permissions.map(p => {
        if (p.rights_groupes_permissions.some(gp => userGroupes.some(ug => ug.id_groupe === gp.id_groupe))) {
            permissionIdProv += 1
            return {
                id: permissionIdProv,
                id_user: id,
                id_permission: p.id,
                id_branch: null,
                id_category: null
            }
        }
        if (p.rights_user_permissions.length) {
            return p.rights_user_permissions
        }
        return null
    })
        .flat()
        .filter(up => up !== null)

    return userPermissions
}