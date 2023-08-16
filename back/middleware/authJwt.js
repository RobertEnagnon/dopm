const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

verifyToken = (req, res, next) => {
  if (req.url === '/api/auth/signin' || req.url === '/api/auth/forgetPassword') {
    return next();
  }
  let token = req.headers["x-access-token"];

  if (!token) {
    const { authorization } = req.headers
    if (authorization) {
      const bearer = authorization.split(' ')
      token = bearer[1]
    }
  }

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }

    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  const user = prisma.user.findUnique({
    where: {
      id: req.userId
    }
  }).then(
    prisma.roles.findUnique({
      where: {
        name: user.roles
      }
    }).then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    })
  )
};

/*isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};*/

/*isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};*/

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  //isModerator: isModerator,
  //isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
