const { PrismaClient } = require("@prisma/client");
const { nanoid } = require("nanoid");
const daysjs = require("dayjs");
const prisma = new PrismaClient();
var nodemailer = require("nodemailer");
const { buildMailFicheSec, buildMailFicheSecUpdate } = require("../../utils/buildMailFicheSec");
const { imageConverter } = require("../../utils/imageConverter");
const fs = require('fs');
const path = require('path')
const { traduction, defaultLang } = require("../../utils/traduction");
const t = traduction(defaultLang)


const {
  SERVER_URL,
  MAIL_HOST,
  MAIl_FROM,
  MAIL_PORT,
  MAIL_PASSWORD
} = process.env


// Récupérer toutes les fiches
exports.getAllFiches = async () => {
  return await prisma.fs_fichesecurites
    .findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        service: true,
        team: true,
        responsibleSecurite: true,
        responsibleConservatoire: true,
        FSCategory: true,
        subzone: true,

        zone: {
          select: {
            id: true,
            name: true,
            description: true,
            subzones: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        classification: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
          }
        }
        // deadLineConservatoire: true,
      },
    });
};

// Récupérer une seule fiche (id)
exports.getOneFiche = async (req, res, next) => {
  const reqType = req.query.reqType;
  if (reqType) {
    if (reqType === "next") {
      // console.log(parseInt(req.params.id));
      const nextFiche = await prisma.fs_fichesecurites.findFirst({
        where: { id: { gt: parseInt(req.params.id) } },
        orderBy: { id: "asc" },
      });
      if (nextFiche) return res.status(200).json(nextFiche);
      return res.status(404).json({ error: "Fiche not found" });
    }
    if (reqType === "previous") {
      const previousFiche = await prisma.fs_fichesecurites.findFirst({
        where: { id: { lt: parseInt(req.params.id) } },
        orderBy: { id: "desc" },
      });
      if (previousFiche) return res.status(200).json(previousFiche);
      return res.status(404).json({ error: "Fiche not found" });
      // res.status(200).json(previousFiche || {});
    }
  } else {
    const ficheSecurite = await prisma.fs_fichesecurites
      .findUnique({
        where: {
          id: parseInt(req.params.id, 10),
        },
        include: {
          service: true,
          team: true,
          responsibleSecurite: true,
          responsibleConservatoire: true,
          classification: true,
          FSCategory: true,
          subzone: true,
          zone: {
            select: {
              id: true,
              name: true,
              description: true,
              subzones: true,
              createdAt: true,
              updatedAt: true,
            },
          },

          classification: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true
            }
          }
          // deadLineConservatoire: true,
        },
      })
      .then((fiche) => {
        res.status(201).json(fiche);
      })
      .catch((error) => {
        res.status(200).json({
          error: "getOneFiche : " + error,
        });
      });
  }
};

const extractFiche = (fiche) => {

  return {
    id: fiche.id,
    id_fs: fiche.id_fs,
    senderFirstname: fiche.senderFirstname,
    senderLastname: fiche.senderLastname,
    sender: `${fiche.senderFirstname} ${fiche.senderLastname}`,
    description: fiche.description || "",
    mesureSecurisation: fiche.mesureSecurisation || "",
    mesureConservatoire: fiche.mesureConservatoire || "",
    deadLineConservatoire: fiche.deadLineConservatoire? daysjs(new Date(fiche.deadLineConservatoire)).format("YYYY/MM/DD"): "",
    service: fiche.service? fiche.service.name: "",
    team: fiche.team? fiche.team.name: "",
    responsibleSecurite: fiche.responsibleSecurite? `${fiche.responsibleSecurite.first_name} ${fiche.responsibleSecurite.last_name}`: "",
    responsibleConservatoire: fiche.responsibleConservatoire? `${fiche.responsibleConservatoire.first_name} ${fiche.responsibleConservatoire.last_name}`: "",
    zone: fiche.zone? fiche.zone.name: "",
    subzone: fiche.subzone? fiche.subzone.name: "",
    status: fiche.status || "",
    createdAt: fiche.createdAt? daysjs(new Date(fiche.createdAt)).format("YYYY/MM/DD"): "",
    updatedAt: fiche.updatedAt? daysjs(new Date(fiche.updatedAt)).format("YYYY/MM/DD"): "",
    category: fiche.FSCategory? fiche.FSCategory.name: "",
    classification: fiche.classification? fiche.classification.name: "",
    image1: fiche.image1?  `${process.env.SERVER_URL}${fiche.image1}`: "",
    image2: fiche.image2?  `${process.env.SERVER_URL}${fiche.image2}`: "",
    image3: fiche.image3?  `${process.env.SERVER_URL}${fiche.image3}`: "",
    commentaireStatus: fiche.commentaireStatus || ""
  }
}

// Créer une fiche
exports.createFiche = async (req, res, next) => {
  console.log("create Fiche");

  let idfs = req.body.id_fs;
  let senderFirstname = req.body.senderFirstname;
  let senderLastname = req.body.senderLastname;
  const serviceId = parseInt(req.body.serviceId);
  const teamId = parseInt(req.body.teamId);
  const FSCategoryId = parseInt(req.body.fsCategoryId);
  const responsibleSecuriteId = parseInt(req.body.responsibleSecuriteId);
  const responsibleConservatoireId = req.body.responsibleConservatoireId;

  const zoneId = parseInt(req.body.zoneId);
  const subZoneId = parseInt(req.body.subzoneId);
  const description = req.body.description;
  const mesureSecurisation = req.body.mesureSecurisation;
  const mesureConservatoire = req.body.mesureConservatoire;
  const deadLineConservatoire = req.body.deadLineConservatoire;
  const { image1, image2, image3 } = req.body;
  // const deadLineSecurisation = req.body.deadLineSecurisation;
  senderFirstname = senderFirstname.trim();
  senderLastname = senderLastname.trim();

  const createdFiche = await prisma.fs_fichesecurites.create({
    data: {
      id_fs: idfs,
      senderFirstname: senderFirstname,
      senderLastname: senderLastname,
      description: description,
      mesureConservatoire: mesureConservatoire,
      mesureSecurisation: mesureSecurisation,
      deadLineConservatoire: deadLineConservatoire
        ? new Date(deadLineConservatoire)
        : null,
      service_id: serviceId,
      team_id: teamId,
      responsibleSecurite_id: responsibleSecuriteId,
      responsibleConservatoire_id: responsibleConservatoireId
        ? parseInt(responsibleConservatoireId)
        : null,
      fsCategory_id: FSCategoryId,
      zone_id: zoneId,
      subzone_id: subZoneId,
      status: "Nouvelle",
      ...( image1 && { image1 }),
      ...( image2 && { image2 }),
      ...( image3 && { image3 }),
    },
  })

  const newFiche = await prisma.fs_fichesecurites.findUnique({
    where: {
      id: parseInt(createdFiche.id),
    },
    include: {
      service: true,
      team: true,
      responsibleSecurite: true,
      responsibleConservatoire: true,
      classification: true,
      FSCategory: true,
      subzone: true,
      zone: {
        select: {
          id: true,
          name: true,
          description: true,
          subzones: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      classification: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      }
      // deadLineConservatoire: true,
    },
  })

  let notifications = await prisma.fs_notification.findMany({
    where: { zone_id: zoneId, isSubscribed: true },
    include: { zone: true, responsable: true },
  })

  let receiver = notifications.map((no) => {
    if(no.responsable) {
      return no.responsable
    }
  })
  receiver.push(newFiche.responsibleConservatoire)

  let transporter = nodemailer.createTransport({
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
  })

  receiver.filter(n => n !== null && n !== undefined).forEach((responsable) => {
    let newData = extractFiche(newFiche)
    let attachments = [
      {
        filename: newData.image1.split('/').at(-1),
        path: newData.image1,
        href: newData.image1,
        contentType: "image/webp",
        cid: nanoid() + "@nodemailer.com"
      },
      {
        filename: newData.image2.split('/').at(-1),
        path: newData.image2,
        href: newData.image1,
        contentType: "image/webp",
        cid: nanoid() + "@nodemailer.com"
      },
      {
        filename: newData.image3.split('/').at(-1),
        path: newData.image3,
        href: newData.image1,
        contentType: "image/webp",
        cid: nanoid() + "@nodemailer.com"
      }
    ]
    const dataHtml = buildMailFicheSec(newData, responsable, attachments, req.body.lang)
    let mailOptions = {
      from: MAIl_FROM,
      to: responsable.email,
      subject: `${t(req.body.lang, "mail.text26")} ${newFiche.id_fs} ${t(req.body.lang, "mail.text28")}`,
      html: dataHtml,
      attachments: attachments,
      alternatives: [
        {
            contentType: 'text/html',
            content: dataHtml
        }
      ]
    }

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
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });

  return res.status(201).json({ newFiche: newFiche });
};

// Modifier une fiche (id)
exports.updateFiche = async (req, res, next) => {
  console.log("updateFiche");

  const FSCategory = parseInt(req.body.fsCategoryId);
  const FSClassification = parseInt(req.body.classificationId);

  let senderFirstname = req.body.senderFirstname;
  let senderLastname = req.body.senderLastname;
  let description = req.body.description;
  let mesureSecurisation = req.body.mesureSecurisation;
  let mesureConservatoire = req.body.mesureConservatoire;

  let status = req.body.status;

  const serviceId = parseInt(req.body.serviceId);
  const teamId = parseInt(req.body.teamId);
  const zoneId = parseInt(req.body.zoneId);
  const subZoneId = parseInt(req.body.subzoneId);

  const respSecuId = parseInt(req.body.responsibleSecuriteId);
  const respConsId = parseInt(req.body.responsibleConservatoireId);
  const { image1, image2, image3, commentaireStatus } = req.body;
  // const commentaireStatus =req.body.

  // const deadLineSecurisation = req.body.deadLineSecurisation;
  const deadLineConservatoire = req.body.deadLineConservatoire;

  // console.log(req.body);

  const researchFiche = await prisma.fs_fichesecurites.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      service: true,
      team: true,
      responsibleSecurite: true,
      responsibleConservatoire: true,
      classification: true,
      FSCategory: true,
      subzone: true,
      zone: {
        select: {
          id: true,
          name: true,
          description: true,
          subzones: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      classification: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
  })
  //supression des anciennes images si il y a des nouvelles
  const basePath = process.cwd() + "\\public"
  if(researchFiche.image1 !== image1){
    fs.access(basePath + researchFiche.image1, (err) => {
      if(!err){
        //fs.unlinkSync(basePath + researchFiche.image1)
      }
    })
  }
  if(researchFiche.image2 !== image2){
    fs.access(basePath + researchFiche.image2, (err) => {
      if(!err){
        //fs.unlinkSync(basePath + researchFiche.image2)
      }
    })
  }
  if(researchFiche.image3 !== image3){
    fs.access(basePath + researchFiche.image3, (err) => {
      if(!err){
        //fs.unlinkSync(basePath + researchFiche.image3)
      }
    })
  }
  /////
  if (researchFiche) {
    await prisma.fs_fichesecurites
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          fsCategory_id: FSCategory,
          classification_id: FSClassification,
          senderFirstname: senderFirstname,
          senderLastname: senderLastname,
          description: description,
          mesureSecurisation: mesureSecurisation,
          mesureConservatoire: mesureConservatoire,
          status: status,
          service_id: serviceId,
          team_id: teamId,
          zone_id: zoneId,
          subzone_id: subZoneId,

          responsibleSecurite_id: respSecuId,
          responsibleConservatoire_id: respConsId,

          // deadLineSecurisation: new Date(deadLineSecurisation),
          deadLineConservatoire: new Date(deadLineConservatoire),

          updatedAt: new Date(),
          image1,
          image2,
          image3,
          commentaireStatus,
        },
      })
      .then(async () => {
        const newFiche = await prisma.fs_fichesecurites.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
          include: {
            service: true,
            team: true,
            responsibleSecurite: true,
            responsibleConservatoire: true,
            classification: true,
            FSCategory: true,
            subzone: true,
            zone: {
              select: {
                id: true,
                name: true,
                description: true,
                subzones: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        });
        const notifications = await prisma.fS_notification.findMany({
          where: { zone_id: zoneId, isSubscribed: true },
          include: { zone: true, responsable: true },
        });

        let receiver = notifications.map((no) => {
          if(no.responsable) {
            return no.responsable
          }
        })
        receiver.push(newFiche.responsibleConservatoire)

        let transporter = nodemailer.createTransport({
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

        receiver.filter(n => n !== null && n !== undefined).forEach((responsable) => {
          let newData = extractFiche(newFiche)
          let oldData = extractFiche(researchFiche)
          let attachments = [
            {
              filename: newData.image1.split('/').at(-1),
              path: newData.image1,
              href: newData.image1,
              contentType: "image/webp",
              cid: nanoid() + "@nodemailer.com"
            },
            {
              filename: newData.image2.split('/').at(-1),
              path: newData.image2,
              href: newData.image1,
              contentType: "image/webp",
              cid: nanoid() + "@nodemailer.com"
            },
            {
              filename: newData.image3.split('/').at(-1),
              path: newData.image3,
              href: newData.image1,
              contentType: "image/webp",
              cid: nanoid() + "@nodemailer.com"
            }
          ]
          const dataHtml = buildMailFicheSecUpdate(oldData, newData, responsable, attachments, req.body.lang)
          let mailOptions = {
            from: MAIl_FROM,
            to: responsable.email,
            subject: `${t(req.body.lang, "mail.text26")} ${newFiche.id_fs} ${t(req.body.lang, "mail.text27")}`,
            html: dataHtml,
            attachments: attachments,
            alternatives: [
              {
                  contentType: 'text/html',
                  content: dataHtml
              }
            ]
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
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        });

        res.status(201).json({
          message: "Fiche updated successfully!",
        });
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update fiche : " + error,
        });
      });

    // console.log(updateFiche);
  }
};

// Upload d'un fichier
exports.upload = async (req, res) => {
  // console.log(req.body);
  // console.log("files", req.files);
  const file = req.files.file;
  const subfolder = req.body.subfolder;
  // console.log(Object.keys(req));
  if (file) {
    // console.log(req.body.file);
    // console.log(req.files);
    const splitName = file.name.split(".");
    const newName = nanoid();
    // uploadPath1 = "/images/" + file.name;
    // //chemin d'acces au dossier des avatars
    // uploadPath = process.cwd() + "/public/images/" + file.name;
    //lien pour url USER
    let uploadPath1 = "/images/" + `${subfolder? subfolder: ''}${subfolder? '/' : ''}${newName}.webp`;

    //chemin d'acces au dossier des avatars
    let uploadPath =
      process.cwd() +
      "/public/images/" +
      `${subfolder? subfolder: ''}${subfolder? '/' : ''}${newName}.${splitName[splitName.length - 1]}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, async function (err) {
      if (err){
        return res.status(500).send(err);
      }
      const finalPath = process.cwd() +
      "/public/images/" +
      `${subfolder? subfolder: ''}${subfolder ? '/' : ''}${newName}.webp`;

      await imageConverter(uploadPath, finalPath)
        .then(() => {
          fs.unlinkSync(uploadPath)
        })
        .catch((err) => {
          return res.status(500).send(err);
        })
    })

    return res
      .status(200)
      .json({ message: "Image uploaded", url: uploadPath1 });
  }
  return res.status(400).json({ error: "Bad request" });
};
// Supprimer une fiche
exports.deleteFiche = async (req, res, next) => {
  console.log("deleteFiche");

  const researchFiche = await prisma.fs_fichesecurites.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  //supression des images si ils existent
  const basePath = process.cwd() + "/public"
  fs.access(basePath + researchFiche.image1, (err) => {
    if(!err){
      fs.unlinkSync(basePath + researchFiche.image1)
    }
  })
  fs.access(basePath + researchFiche.image2, (err) => {
    if(!err){
      fs.unlinkSync(basePath + researchFiche.image2)
    }
  })
  fs.access(basePath + researchFiche.image3, (err) => {
    if(!err){
      fs.unlinkSync(basePath + researchFiche.image3)
    }
  })
  //////
  if (researchFiche) {
    const deleteFiche = await prisma.fs_fichesecurites.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json({
      message: "FicheSecurite deleted successfully!",
    });
  } else {
    res.status(400).json({
      error: "Bad Fiche id",
    });
  }
};

exports.getImageFiche = async (req, res, next) => {
  // const imgPath = __dirname+'../../../public/images/fichesecurite/'+ req.body.url.split('/').at(-1)
  const imgPath = process.cwd() + "/public" + req.body.url
  console.log("imgPath")
  console.log(imgPath)
  fs.readFile(imgPath, (err, data)=>{
      if(err) {
          console.log(err)
          res.status(500).send(err)
      }
      const extensionName = path.extname(imgPath);
      const base64Image = Buffer.from(data, 'binary').toString('base64');
      const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
      console.log('create base64 for image', req.body.url)
      res.status(200).json({base64: base64ImageStr})
  })
}
