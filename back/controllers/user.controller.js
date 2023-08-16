const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");
const fs = require('fs');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
//a reflechir si vraiment utile. Je prefere un seul espace avec affichage conditionnel plutot que trois differents
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getAllUsers = (req, res, next) => {
  const users = prisma.user.findMany({
    include: {
      role: true,
      language: true,
      groupes: true,
      permissions: true,
      service: true
    },
  })
    .then(
      (user) => {
        res.status(201).json(user)
      }).catch(
        (error) => {
          res.status(400).json({
            error: "GetAllUser : " + error
          });
        }
      );
};

exports.createUser = async (body) => {
  console.log("createUser")
  console.log(body)

  let lastname = body.last_name;
  let firstname = body.first_name;
  let fonction = body.fonction;
  let createdAt = new Date(body.createdAt);
  let username = body.username;
  let email = body.email;
  let password = bcrypt.hashSync(body.password, 8);
  let serviceId = body.serviceId;
  let roles = body.roles;
  let languages = body.language;


  const user = await prisma.user.create({
    data: {
      last_name: lastname,
      first_name: firstname,
      email: email,
      fonction: fonction,
      username: username,
      password: password,
      url: '',
      serviceId: serviceId
    },
  })

  const role = await prisma.roles.findUnique({
    where: {
      name: roles,
    },
  })

  const language = await prisma.languages.findUnique({
    where: {
      name: languages,
    },
  })
  if (language) {
    console.log(language)
    const user_languages = await prisma.user_language.create({
      data: {
        userId: user.id,
        languageId: language.id,
      }
    })

    const newUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        language: true,
      },
    })

    console.log("new  LANGUAGE created")
    console.log(newUser)
  } else {
    throw "Pas de language pour l'utilisateur"
  }

  if (role) {
    const user_roles = await prisma.user_roles.create({
      data: {
        userId: user.id,
        roleId: role.id,
      }
    })

    const newUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        role: true,
        service: true
      },
    })

    console.log("new user created")
    console.log(newUser)

    return {
      user: newUser,
      message: "User was registered successfully!"
    };
  } else {
    throw "Pas de roles pour l'utilisateur"
  }
};

exports.updateUser = async (id, body) => {
  console.log("updateUser")
  //console.log(id);
  console.log(body)

  let lastname = body.last_name;
  let firstname = body.first_name;
  let fonction = body.fonction;
  let createdAt = new Date(body.createdAt);
  let username = body.username;
  let email = body.email;
  let isResponsible = body.isResponsible;
  let serviceId = body.serviceId;
  let req_role;
  let req_language;

  if (body.roles == 1) {
    req_role = "user";
  } else if (body.roles == 2) {
    req_role = "admin";
  } else {
    req_role = body.roles;
  }

  if (typeof body.language === 'string') {
    if (body.language == "french") {
      req_language = 1;
    } else if (body.language == "english") {
      req_language = 2;
    } else if (body.language == "spanish") {
      req_language = 3;
    }
    else {
      // console.log(req_language);
      req_language = body.language;
    }
  } else {
    if (typeof body.language === 'object') {
      req_language = body.language.languageId
    } else {
      req_language = 1
    }
  }

  const researchUserById = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      role: true,
      language: true,
    }
  })

  console.log("researchUserById");
  console.log(researchUserById);

  if (researchUserById) {
    const find_role = await prisma.roles.findUnique({
      where: {
        name: req_role,
      },
    })

    if (find_role) {
      console.log("find_role")
      console.log(find_role)
      console.log("juste avant suppression role")
      console.log(researchUserById.role[0].roleId)
      const select_user_roles = await prisma.user_roles.findUnique({
        where: {
          roleId_userId: {
            userId: parseInt(id),
            roleId: researchUserById.role[0].roleId,
          }
        }
      })
      const update_User_language = await prisma.user_language.update({
        where: {
          languageId_userId: {
            userId: parseInt(id),
            languageId: parseInt(researchUserById.language[0].languageId),
          }
        },
        data: {
          languageId: parseInt(req_language),
        }
      })
      const update_user_roles = await prisma.user_roles.update({
        where: {
          roleId_userId: {
            userId: parseInt(id),
            roleId: parseInt(researchUserById.role[0].roleId),
          }
        },
        data: {
          roleId: parseInt(find_role.id),
        }
      })
      console.log("juste apres update role")
      console.log(update_user_roles)
    }

    try {
      await prisma.user.update({
        where: {
          id: parseInt(id)
        },
        data: {
          last_name: lastname,
          first_name: firstname,
          fonction: fonction,
          createdAt: createdAt,
          username: username,
          email: email,
          isResponsible: isResponsible,
          serviceId: serviceId
        }
      })
      return {
        message: 'Post updated successfully!'
      }
    } catch (error) {
      return {
        error: "UpdateUser : " + error
      }
    }
  }
}

exports.deleteUser = async (req, res, next) => {
  console.log("deleteUser")
  console.log(req.params.id)

  const researchUser = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
  console.log(researchUser)
  if (researchUser) {
    let reasearchUserRoles = await prisma.user_roles.findUnique({
      where: {
        roleId_userId: {
          userId: parseInt(req.params.id),
          roleId: 1
        }
      }
    })

    console.log("User_Role")
    console.log(reasearchUserRoles)

    if (!reasearchUserRoles) {
      reasearchUserRoles = await prisma.user_roles.findUnique({
        where: {
          roleId_userId: {
            userId: parseInt(req.params.id),
            roleId: 2
          }
        }
      })
    }

    if (reasearchUserRoles) {
      let reasearchUserLanguage = await prisma.user_language.findFirst({
        where: {
          userId: parseInt(req.params.id),
        }
      })
      deleteUserLanguage = await prisma.user_language.delete({
        where: {
          languageId_userId: {
            userId: parseInt(req.params.id),
            languageId: reasearchUserLanguage.languageId
          }
        }
      })
      deleteUserRoles = await prisma.user_roles.delete({
        where: {
          roleId_userId: {
            userId: parseInt(req.params.id),
            roleId: reasearchUserRoles.roleId
          }
        }
      })
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
      .then(() => {
        if (researchUser.url !== '') {
          fs.access(process.cwd() + "/public" + researchUser.url, (err) => {
            if (!err) {
              fs.unlinkSync(process.cwd() + "/public" + researchUser.url)
            }
          })
        }
        res.status(201).json({
          message: 'Post deleted successfully!'
        })
      })
      .catch((error) => {
        console.log("user supp error", error)
        res.status(400).json({
          error: "DeleteUser: " + error
        })
      })
  }
}
