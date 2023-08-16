const { PrismaClient } = require('@prisma/client');

const  prisma = new PrismaClient()

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  console.log("verifySignUp => checkDuplicateUsernameOrEmail");
  console.log(req.body);
  console.log("contrôle username");
  
  // Username
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  })
   .then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    console.log("contrôle email");
    // Email
    prisma.user.findUnique({
      where: {
        email: req.body.email,
      }
    })
    .then(users => {
      if (users) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

exports.checkRolesExisted = async (req, res, next) => {
  console.log("verifySignUp => checkRolesExisted")
  console.log(req.body.roles)
  if (req.body.roles) {
    prisma.roles.findUnique({
      where: {
        name: req.body.roles,
      }
    })
    /*.then(roles => {
      console.log(roles)
      if (!roles) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles
        });
        return;
      }

      next();
    });*/
    
    /*for (let i = 0; i < req.body.roles.length; i++) {
      //if (!ROLES.includes(req.body.roles[i])) {
      if (!roles.includes(req.body.roles)) {
        res.status(400).send({
          //message: "Failed! Role does not exist = " + req.body.roles[i]
          message: "Failed! Role does not exist = " + req.body.roles
        });
        return;
      }
    //}*/
  }
  
  next();
};

/*const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;*/
