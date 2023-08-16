const config = require("../config/auth.config");
const fs = require("fs");
const { nanoid } = require("nanoid");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
const buildMail = require("../utils/buildMail");

const { PrismaClient } = require("@prisma/client");
const { imageConverter, fileNameParser } = require("../utils/imageConverter");

const prisma = new PrismaClient();

const { MAIL_HOST, MAIl_FROM, MAIL_PORT, MAIL_PASSWORD } = process.env;

const getUserRights = async (userId) => {
  const permissions = await prisma.rights_permissions.findMany({
    include: {
      rights_groupes_permissions: true,
      rights_user_permissions: true,
    },
  });
  const userGroupes = await prisma.rights_user_groupes.findMany({
    where: {
      id_user: userId,
    },
  });

  let permissionIdProv = new Date().getTime()
  return permissions.map(p => {
    if (p.rights_groupes_permissions.some(gp => userGroupes.some(ug => ug.id_groupe === gp.id_groupe))) {
      permissionIdProv += 1
      return {
        id: permissionIdProv,
        id_user: userId,
        id_permission: p.id,
        id_branch: null,
        id_category: null,
        id_dashboard: null
      }
    }
    const permissionsSpecifiques = p.rights_user_permissions.filter(up => up.id_user === parseInt(userId));
    return permissionsSpecifiques.length ? permissionsSpecifiques : null
  })
    .flat()
    .filter((up) => up !== null);
}

/**
 * Ici on retourne des status(200) meme quand il y a probleme
 * La difference se situe au niveau de {message: ...} et {error: ...}
 * Ceci donne la possibilité d'utiliser le contenu des message d'erreur dans {error: ...}
 */
exports.signin = async (req, res) => {
  console.log("auth.controller => signin");
  console.log(req.body);

  if (!req.body.username) {
    return res.status(200).json({ error: "Une erreur est survenue" });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
    include: {
      permissions: true,
      groupes: true,
      service: true,
    },
  });
  console.log("apres findUnique user");
  console.log(user);

  if (!user) {
    return res.status(200).json({ error: "Utilisateur non trouvé" });
  }

  console.log("controle du password");
  console.log(req.body.password);
  console.log(user.password);

  var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  console.log("passwordIsValid");
  console.log(passwordIsValid);

  if (!passwordIsValid) {
    return res.status(200).send({
      accessToken: null,
      error: "Mot de passe incorrect",
    });
  }

  var token = jwt.sign({ id: user.id }, config.secret, {
    // 24 hours
    expiresIn: "24h",
    // 5 secondes
    //expiresIn: 10
  });

  console.log("token");
  console.log(token);

  let language;
  try {
    //car ceci pourrait echouer
    const userlanguage = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        language: true,
      },
    });

    console.log("userlanguage");
    console.log(userlanguage);

    language = userlanguage.language[0].languageId;
    console.log("____________________________________________" + language);
  } catch (err) {
    return res.status(200).send({
      accessToken: null,
      error:
        "Une erreur est survenue pendant la recuperation des données du langage",
    });
  }
  let roles;
  try {
    //car ceci pourrait echouer
    const userroles = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        role: true,
      },
    });

    console.log("userroles");
    console.log(userroles);

    roles = await prisma.roles.findUnique({
      where: {
        id: userroles.role[0].roleId,
      },
    });
  } catch (err) {
    return res.status(200).send({
      accessToken: null,
      error:
        "Une erreur est survenue pendant la recuperation des données du role",
    });
  }

  console.log("roles");
  console.log(roles);
  console.log("fin du traitement signin");

  // Gestion des droits :
  const userPermissions = await getUserRights(user.id)

  res.status(200).json({
    id: user.id,
    lastname: user.last_name,
    firstname: user.first_name,
    email: user.email,
    function: user.fonction,
    username: user.username,
    password: user.password,
    roles: roles.name,
    language: language,
    accessToken: token,
    createdAt: user.createdAt,
    url: user.url,
    isAlterateDate: user.isAlterateDate,
    permissions: userPermissions,
    service: user.service,
  });
};

exports.refreshRights = async (req, res) => {
  // Gestion des droits :
  const userPermissions = await getUserRights(req.userId)

  res.status(200).json({ permissions: userPermissions });
};

exports.signup = async (req, res) => {
  console.log("auth.controller => signup");
  console.log(req.body);
  const user = await prisma.user.create({
    data: {
      last_name: req.body.lastname,
      first_name: req.body.firstname,
      email: req.body.email,
      fonction: req.body.fonction,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      url: "",
    },
  });
  console.log("apres req create user");
  console.log(user);

  const role = await prisma.roles.findUnique({
    where: {
      name: req.body.roles,
    },
  });

  console.log("début update user_roles");
  console.log(role);

  if (role) {
    const user_roles = await prisma.user_roles.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    console.log("fin update");
    console.log(user_roles);

    console.log("fin du traitement signup");

    res.status(200).json({
      message: "User was registered successfully!",
    });
  } else {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  console.log("auth.controller => forgetPassword");
  console.log(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  console.log("apres findUnique user");
  console.log(user);

  if (!user) {
    return res.status(200).json({ error: "Utilisateur non trouvé" });
  } else {
    var transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT, //465,
      secure: false, //true,
      auth: {
        //type: 'OAuth2',
        user: MAIl_FROM,
        pass: MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: "24h", // 24 hours
    });
    let mailOptions = {
      from: MAIl_FROM,
      to: req.body.email,
      subject: "Account reset password link",
      html: buildMail.buildMail(
        `${process.env.CLIENT_URL}/auth/reset-password/token?t=${token}`
      ),
    };

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res
          .status(200)
          .json({ error: "Erreur lors de l'envoi du mail" });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({ message: "Email envoyé !" });
  }
};

exports.changeProfile = async (req, res) => {
  console.log("auth.controller => changeProfile");
  console.log(req.body);
  let id = req.body.id;
  let email = req.body.email;
  let fonction = req.body.fonction;
  let username = req.body.username;
  let file;

  if (req.files) {
    file = req.files.file;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  console.log("nouveau / ancien");
  console.log(email, user.email);
  console.log(fonction, user.fonction);
  console.log(username, user.username);
  console.log(file);

  console.log("preparation upload");
  let uploadPath;
  let uploadPath1;

  if (file) {
    //lien pour url USER
    const suffix = nanoid();
    const parsedName = fileNameParser(file.name, suffix, false);
    uploadPath1 = "/images/profil/" + parsedName;
    //chemin d'acces au dossier des avatars
    uploadPath = process.cwd() + "/public/images/profil/" + parsedName;

    console.log(uploadPath1);
    console.log(uploadPath);

    const updateUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        url: uploadPath1,
      },
    });

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function (err) {});
    //remove old file
    if (user.url !== "") {
      fs.access(process.cwd() + "/public" + user.url, (err) => {
        if (!err) {
          fs.unlinkSync(process.cwd() + "/public" + user.url);
        }
      });
    }
  }

  if (
    email != user.email ||
    username != user.username ||
    fonction != user.fonction ||
    url != user.url
  ) {
    const changeProfileUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        email: email,
        username: username,
        fonction: fonction,
        url: uploadPath1,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    var token = jwt.sign({ id: user.id }, config.secret, {
      // 24 hours
      expiresIn: "24h",
    });
    const userroles = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        role: true,
      },
    });
    const roles = await prisma.roles.findUnique({
      where: {
        id: userroles.role[0].roleId,
      },
    });

    res.status(201).send({
      id: user.id,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      fonction: user.fonction,
      username: user.username,
      password: user.password,
      roles: roles.name,
      accessToken: token,
      created_at: user.createdAt,
      url: user.url,
    });
  } else {
    res.status(400).json({ message: "pas de changement constaté" });
  }
};

exports.changePassword = async (req, res) => {
  console.log("auth.controller => changePassword");
  console.log(req.body);
  let id = req.body.id;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  const findUser = await prisma.user.findUnique({ where: { id: id } });
  console.log("apres findUnique user");
  console.log(findUser);

  if (!findUser) {
    return res.status(404).send({ message: "User Not found." });
  }

  console.log("nouveau / ancien");
  console.log(oldPassword, newPassword);

  console.log("controle du password");
  console.log(bcrypt.hashSync(oldPassword, 8), findUser.password);
  var passwordIsValid = bcrypt.compareSync(oldPassword, findUser.password);

  console.log("passwordIsValid");
  console.log(passwordIsValid);

  if (!passwordIsValid) {
    /**
     * On fait comprendre à l'utilisateur que son mot de passe ne correspond pas
     * Car en renvoyant un status 401 on provoque un rechargement de la page (voir front/src/services/request.ts)
     */
    return res.status(200).send({
      accessToken: null,
      error: "Mot de passe invalide!",
    });
  }
  const changePassword = await prisma.user.update({
    where: { id: id },
    data: {
      password: bcrypt.hashSync(newPassword, 8),
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  var token = jwt.sign({ id: user.id }, config.secret, {
    // 24 hours
    expiresIn: "24h",
  });
  const userroles = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      role: true,
    },
  });
  const roles = await prisma.roles.findUnique({
    where: {
      id: userroles.role[0].roleId,
    },
  });

  /**
   * on renvoie un objet identique à celui attendu au front notamment pour le localStorage
   */
  res.status(201).send({
    id: user.id,
    lastname: user.last_name,
    firstname: user.first_name,
    email: user.email,
    function: user.fonction,
    username: user.username,
    password: user.password,
    roles: roles.name,
    accessToken: token,
    createdAt: user.createdAt,
    url: user.url,
  });
};

exports.forgetPasswordWithToken = async (req, res) => {
  console.log("auth.controller => forgetPasswordWithToken");
  console.log(req.body.token);
  console.log(req.body.newPassword);

  var decoded = jwt.verify(req.body.token, config.secret);
  console.log(decoded.id);
  let id = decoded.id;
  let newPassword = req.body.newPassword;

  const user = await prisma.user.findUnique({ where: { id: id } });
  console.log("apres findUnique user");
  console.log(user);

  if (!user) {
    return res.status(200).send({ error: "Utilisateur non trouvé" });
  }

  console.log("nouveau");
  console.log(newPassword);

  const changePassword = await prisma.user.update({
    where: { id: id },
    data: {
      password: bcrypt.hashSync(newPassword, 8),
    },
  });
  console.log("MAJ success username user");
  console.log(changePassword);
  res
    .status(201)
    .json({ user: changePassword, message: "Mot de passe changé avec succes" });
};

exports.imgProfile = async (req, res) => {
  console.log("imgProfile");

  //Vérification de l'ID
  const findUser = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (findUser) {
    console.log("preparation upload");
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;

    const suffix = nanoid();
    const nameParsed = fileNameParser(sampleFile.name, suffix, false);
    //lien pour url USER
    const uploadPath1 =
      /*SERVER_URL +*/ "/images/profil/" +
      fileNameParser(sampleFile.name, suffix) +
      ".webp";
    //chemin d'acces au dossier des avatars
    uploadPath = process.cwd() + "/public/images/profil/" + nameParsed;
    const updateUser = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        url: uploadPath1,
      },
    });
    console.log("apres updateUser");
    console.log(updateUser);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      const finalPath =
        process.cwd() +
        "/public/images/profil/" +
        fileNameParser(sampleFile.name, suffix) +
        ".webp";
      /**
       * On converti l'image en .webp et on la place au meme emplacement que la version non convertie
       * Puis on supprime la version non convertie
       */
      await imageConverter(uploadPath, finalPath)
        .then(() => {
          fs.unlinkSync(uploadPath);
          const oldImg = process.cwd() + "/public" + findUser.url;
          if (findUser.url !== "") {
            fs.access(oldImg, (err) => {
              if (!err) {
                fs.unlinkSync(oldImg);
              }
            });
          }
        })
        .catch((err) => {
          console.log("save img error", err);
          return res.status(500).send(err);
        });
      return res.status(201).json({ user: updateUser });
    });
  }
};
