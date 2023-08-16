const { PrismaClient } = require("@prisma/client");
const { nanoid } = require("nanoid");
const daysjs = require("dayjs");
const prisma = new PrismaClient();
var nodemailer = require("nodemailer");
const { buildMailFicheInf, buildMailFicheInfUpdate } = require("../../utils/buildMailFicheInf");
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
exports.getAllFiches = async (req, res, next) => {
  await prisma.fi_ficheinfirmeries
    .findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        injuredCategory: true,
        responsibleSecurite: true,
        service: true,
        team: true,
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
        subzone: true,
        materialElements: true,
        lesionDetails: true,
        careProvided: true,
        classification: true,
        assignation: true
      },
    })
    .then((fiches) => {
      res.status(201).json(fiches);
    })
    .catch((error) => {
      console.log('getAllFiche error', error)
      res.status(200).json({
        error: "getAllFiche : " + error,
      })
    })
}

// Récupérer une seule fiche (id)
exports.getOneFiche = async (req, res, next) => {
  const reqType = req.query.reqType;
  if (reqType) {
    if (reqType === "next") {
      const nextFiche = await prisma.fi_ficheinfirmeries.findFirst({
        where: { id: { gt: parseInt(req.params.id) } },
        orderBy: { id: "asc" },
      })
      if (nextFiche) return res.status(200).json(nextFiche)
      return res.status(404).json({ error: "Fiche not found" })
    }
    if (reqType === "previous") {
      const previousFiche = await prisma.fi_ficheinfirmeries.findFirst({
        where: { id: { lt: parseInt(req.params.id) } },
        orderBy: { id: "desc" },
      });
      if (previousFiche) return res.status(200).json(previousFiche)
      return res.status(404).json({ error: "Fiche not found" })
    }
  } else {
    await prisma.fi_ficheinfirmeries
      .findUnique({
        where: {
          id: parseInt(req.params.id, 10),
        },
        include: {
          injuredCategory: true,
          responsibleSecurite: true,
          service: true,
          team: true,
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
          subzone: true,
          materialElements: true,
          lesionDetails: true,
          careProvided: true,
          classification: true,
          assignation: true
        },
      })
      .then((fiche) => {
        res.status(201).json(fiche);
      })
      .catch((error) => {
        res.status(200).json({
          error: "getOneFiche : " + error,
        })
      })
  }
}

const extractFiche = (fiche) => {
console.log('fiche', fiche)
  return  {
    injuredCategory: fiche.injuredCategory.name,
    injuredCategoryName: fiche.injuredCategoryName? fiche.injuredCategoryName: "",
    senderFirstname: fiche.senderFirstname,
    senderLastname: fiche.senderLastname,
    post: fiche.post,
    responsibleSecurite: fiche.responsibleSecurite? `${fiche.responsibleSecurite.first_name} ${fiche.responsibleSecurite.last_name}`: "",
    service: fiche.service.name,
    team: fiche.team.name,
    dateAccident:  daysjs(new Date(fiche.dateAccident)).format("YYYY/MM/DD"),
    hourAccident: fiche.hourAccident,
    zone: fiche.zone.name,
    subZone: fiche.subzone.name,
    circumstances: fiche.circumstances,
    materialElements: fiche.materialElements.name,
    lesionDetails: fiche.lesionDetails.name,
    lesionImage: fiche.lesionImage? SERVER_URL + fiche.lesionImage: "",
    careProvided: fiche.careProvided.name,
    caregiver: fiche.caregiver,
    careGived: fiche.careGived,
    image1: fiche.image1? SERVER_URL + fiche.image1: "",
    classification: fiche.classification? fiche.classification.name: "",
    status: fiche.status? fiche.status: "",
    commentaireStatus: fiche.commentaireStatus? fiche.commentaireStatus: "",
    assignation: fiche.assignation? `${fiche.assignation.first_name} ${fiche.assignation.last_name}`:  "",
    logo: 'https://i.ibb.co/6b7J3j1/logo-sodigitale.png',
    ficheDate: fiche.id_fi
  }
}
// Créer une fiche
exports.createFiche = async (req, res, next) => {
  console.log("create Fiche Inf", req.body);

  const id_fi = req.body.id_fi
  const injuredCategoryId = parseInt(req.body.injuredCategoryId)
  const injuredCategoryName = req.body.injuredCategoryName.length > 0? req.body.injuredCategoryName.trim(): ""
  const senderFirstname = req.body.senderFirstname.trim()
  const senderLastname = req.body.senderLastname.trim()
  const post = req.body.post
  const responsibleSecuriteId = parseInt(req.body.responsibleSecuriteId)
  const serviceId = parseInt(req.body.serviceId);
  const teamId = parseInt(req.body.teamId)
  const dateAccident = req.body.dateAccident
  const hourAccident = req.body.hourAccident
  const zoneId = parseInt(req.body.zoneId)
  const subZoneId = parseInt(req.body.subzoneId)
  const circumstances = req.body.circumstances
  const materialElementsId = req.body.materialElementsId
  const lesionDetailsId = req.body.lesionDetailsId
  const careProvidedId = req.body.careProvidedId
  const caregiver = req.body.caregiver
  const careGived = req.body.careGived
  const image1 = req.body.image1
  const lesionImage = req.body.lesionImage

  const newFiche = await prisma.fi_ficheinfirmeries.create({
    data: {
      id_fi: id_fi,
      injuredCategory_id: parseInt(injuredCategoryId),
      injuredCategoryName: injuredCategoryName,
      senderFirstname: senderFirstname,
      senderLastname: senderLastname,
      post: post,
      responsibleSecurite_id: parseInt(responsibleSecuriteId),
      service_id: parseInt(serviceId),
      team_id: parseInt(teamId),
      dateAccident: dateAccident? new Date(dateAccident): null,
      hourAccident: hourAccident,
      zone_id: parseInt(zoneId),
      subzone_id: parseInt(subZoneId),
      circumstances: circumstances,
      materialElements_id: parseInt(materialElementsId),
      lesionDetails_id: parseInt(lesionDetailsId),
      careProvided_id: parseInt(careProvidedId),
      caregiver: caregiver,
      careGived: careGived,
      status: "Nouvelle",
      image1: image1,
      lesionImage: lesionImage
    },
  })

  const newCreatedFiche = await prisma.fi_ficheinfirmeries.findUnique({
    where: {
      id: parseInt(newFiche.id),
    },
    include: {
      injuredCategory: true,
      responsibleSecurite: true,
      service: true,
      team: true,
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
      subzone: true,
      materialElements: true,
      lesionDetails: true,
      careProvided: true
    }
  })

  const notifications = await prisma.fi_notification.findMany({
    where: { zone_id: zoneId, isSubscribed: true },
    include: { zone: true, responsable: true },
  })

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

  notifications.filter(n => n.responsable !== null && n.responsable !== undefined).forEach((notification) => {
    let receiver = `${notification.responsable.first_name} ${notification.responsable.last_name}`
    let newData = extractFiche(newCreatedFiche)
    let attachments = [
      {
        filename: newData.image1.split('/').at(-1),
        path: newData.image1,
        href: newData.image1,
        contentType: "image/webp",
        cid: nanoid() + "@nodemailer.com"
      },
      /*{ sera peut-etre util si la methode cid est valide
        filename: newData.lesionImage.split('/').at(-1),
        path: newData.lesionImage,
        href: newData.lesionImage,
        contentType: "image/webp",
        cid: nanoid() + "@nodemailer.com"
      }*/
    ]
    const dataHtml = buildMailFicheInf(newData, attachments, req.body.lang, receiver)
    let mailOptions = {
      from: MAIl_FROM,
      to: notification.responsable? notification.responsable.email: "",
      subject: `${t(req.body.lang, "mail.text26")} ${id_fi} ${t(req.body.lang, "mail.text28")}`,
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
    })
  })

  return res.status(201).json({ newFiche: newFiche });
}

// Modifier une fiche (id)
exports.updateFiche = async (req, res, next) => {
  console.log("updateFiche Inf", req.body)

  const injuredCategoryId = parseInt(req.body.injuredCategoryId)
  const injuredCategoryName = req.body.injuredCategoryName.length > 0? req.body.injuredCategoryName.trim(): ""
  const senderFirstname = req.body.senderFirstname.trim()
  const senderLastname = req.body.senderLastname.trim()
  const post = req.body.post
  const responsibleSecuriteId = parseInt(req.body.responsibleSecuriteId)
  const serviceId = parseInt(req.body.serviceId);
  const teamId = parseInt(req.body.teamId)
  const dateAccident = req.body.dateAccident
  const hourAccident = req.body.hourAccident
  const zoneId = parseInt(req.body.zoneId)
  const subZoneId = parseInt(req.body.subzoneId)
  const circumstances = req.body.circumstances
  const materialElementsId = parseInt(req.body.materialElementsId)
  const lesionDetailsId = parseInt(req.body.lesionDetailsId)
  const careProvidedId = parseInt(req.body.careProvidedId)
  const caregiver = req.body.caregiver
  const careGived = req.body.careGived
  const image1 = req.body.image1
  const classificationId = parseInt(req.body.classificationId)
  const status = req.body.status
  const commentaireStatus = req.body.commentaireStatus
  const assignationId = parseInt(req.body.assignationId)
  const lesionImage = req.body.lesionImage

  const researchFiche = await prisma.fi_ficheinfirmeries.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      injuredCategory: true,
      responsibleSecurite: true,
      service: true,
      team: true,
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
      subzone: true,
      materialElements: true,
      lesionDetails: true,
      careProvided: true,
      assignation: true,
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
  const basePath = process.cwd() + "/public"
  if(researchFiche.image1 !== image1){
    fs.access(basePath + researchFiche.image1, (err) => {
      if(!err){
        fs.unlinkSync(basePath + researchFiche.image1)
      }
    })
  }
  if(researchFiche.lesionImage !== lesionImage){
    fs.access(basePath + researchFiche.lesionImage, (err) => {
      if(!err){
        fs.unlinkSync(basePath + researchFiche.lesionImage)
      }else{
        console.log('Error unlink lesionImage', err)
      }
    })
  }
  /////
  try{
    if (researchFiche)
    await prisma.fi_ficheinfirmeries.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        injuredCategory_id: injuredCategoryId,
        injuredCategoryName: injuredCategoryName,
        senderFirstname: senderFirstname,
        senderLastname: senderLastname,
        post: post,
        responsibleSecurite_id: responsibleSecuriteId,
        service_id: serviceId,
        team_id: teamId,
        dateAccident: dateAccident,
        hourAccident: hourAccident,
        zone_id: zoneId,
        subzone_id: subZoneId,
        circumstances: circumstances,
        materialElements_id: materialElementsId,
        lesionDetails_id: lesionDetailsId,
        careProvided_id: careProvidedId,
        caregiver: caregiver,
        careGived: careGived,
        image1: image1,
        classification_id: classificationId,
        status: status,
        commentaireStatus: commentaireStatus,
        assignation_id: assignationId,
        updatedAt: new Date(),
        lesionImage: lesionImage
      },
    })
    const newFiche = await prisma.fi_ficheinfirmeries.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        injuredCategory: true,
        responsibleSecurite: true,
        service: true,
        team: true,
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
        subzone: true,
        materialElements: true,
        lesionDetails: true,
        careProvided: true,
        classification: true,
        assignation: true
      },
    })

    const notifications = await prisma.fi_notification.findMany({
      where: { zone_id: zoneId, isSubscribed: true },
      include: { zone: true, responsable: true },
    })
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

    notifications.filter(n => n.responsable !== null && n.responsable !== undefined).forEach((notification) => {
      let receiver = `${notification.responsable.first_name} ${notification.responsable.last_name}`
      let newData = extractFiche(newFiche)
      let oldData = extractFiche(researchFiche)
      let attachments = [
        {
          filename: newData.image1.split('/').at(-1),
          path: newData.image1,
          href: newData.image1,
          contentType: "image/webp",
          cid: nanoid() + "@nodemailer.com"
        }
      ]
      const dataHtml = buildMailFicheInfUpdate(oldData, newData, attachments, req.body.lang, receiver)
      let mailOptions = {
        from: MAIl_FROM,
        to: notification.responsable? notification.responsable.email: "",
        subject: `${t(req.body.lang, "mail.text26")} ${new Date(newFiche.createdAt).getFullYear()}-${newFiche.id
          } ${t(req.body.lang, "mail.text27")}`,
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
      })
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      })
    })

    res.status(201).json(newFiche)
  }catch(error){
    console.log('Update fi error', error)
    res.status(201).json({
      error: "Update fiche : " + error,
    })
  }
}

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
        console.log('upload file error', err)
        return res.status(500).send(err);
      }else{
        const finalPath = process.cwd() +
        "/public/images/" +
        `${subfolder? subfolder: ''}${subfolder ? '/' : ''}${newName}.webp`;

        await imageConverter(uploadPath, finalPath)
          .then(() => {
            fs.unlinkSync(uploadPath)
            return res.status(200).json({ message: "Image uploaded", url: uploadPath1 })
          })
          .catch((err) => {
            console.log('upload file error', err)
            return res.status(500).send(err);
          })
      }
    })

  }else{
    console.log("Aucun fichier n'a ete trouve")
    return res.status(400).json({ error: "Bad request" });
  }
}
// Supprimer une fiche
exports.deleteFiche = async (req, res, next) => {
  console.log("deleteFiche Inf");

  const researchFiche = await prisma.fi_ficheinfirmeries.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  })
  //supression de l'image si elle existe
  const basePath = process.cwd() + "/public"
  if(researchFiche.image1 && researchFiche.image1 !== ""){
    fs.access(basePath + researchFiche.image1, (err) => {
      if(!err){
        fs.unlinkSync(basePath + researchFiche.image1)
      }else{
        console.log('Error unlink Image1', err)
      }
    })
  }
  if(researchFiche.lesionImage && researchFiche.lesionImage !== ""){
    fs.access(basePath + researchFiche.lesionImage, (err) => {
      if(!err){
        fs.unlinkSync(basePath + researchFiche.lesionImage)
      }else{
        console.log('Error unlink lesionImage', err)
      }
    })
  }
  //////
  if (researchFiche) {
    const deleteFiche = await prisma.fi_ficheinfirmeries.delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    res.status(201).json({
      message: "FicheInfirmerie deleted successfully!",
    })
  } else {
    res.status(400).json({
      error: "Bad Fiche id",
    })
  }
}

exports.getImageFiche = async (req, res, next) => {
  const imgPath = __dirname+'../../../public/images/fichesecurite/'+ req.body.url.split('/').at(-1)
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
