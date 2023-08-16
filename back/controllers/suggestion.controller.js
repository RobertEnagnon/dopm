const { unlink } = require("fs");
const { nanoid } = require("nanoid");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const {
  buildMailSug,
  buildMailSugUpdate,
} = require("../utils/buildMailSuggestion");
const { traduction, defaultLang } = require("../utils/traduction");
const { imageConverter } = require("../utils/imageConverter");
const t = traduction(defaultLang);
const fs = require("fs");

const { SERVER_URL, MAIL_HOST, MAIl_FROM, MAIL_PORT, MAIL_PASSWORD } =
  process.env;

exports.getAllSuggestions = async (req, res, next) => {
  await prisma.sug_suggestions
    .findMany({
      include: {
        sugCategory: true,
        sugClassification: true,
        service: true,
        team: true,
        responsible: true,
        statusWorkflow: true,
      },
      orderBy: { createdAt: "desc" },
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllSuggestions : " + error,
      });
    });
};

exports.getSuggestion = async (req, res, next) => {
  const reqType = req.query.reqType;
  const id = req.params.id;

  if (reqType && reqType === "next") {
    const nextSuggestion = await prisma.sug_suggestions.findFirst({
      where: { id: { gt: parseInt(id) } },
      orderBy: { id: "asc" },
      include: {
        sugCategory: true,
        sugClassification: true,
        service: true,
        team: true,
        responsible: true,
        statusWorkflow: true,
      },
    });
    if (nextSuggestion) return res.status(200).json(nextSuggestion);
    next(new Error("Suggestion not found"));
  }

  if (reqType && reqType === "previous") {
    const previousSuggestion = await prisma.sug_suggestions.findFirst({
      where: { id: { lt: parseInt(id) } },
      orderBy: { id: "desc" },
    });
    if (previousSuggestion) return res.status(200).json(previousSuggestion);
    next(new Error("Suggestion not found"));
  }

  if (!reqType) {
    const suggestion = await prisma.sug_suggestions.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        sugCategory: true,
        service: true,
        team: true,
        responsible: true,
        comity: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (suggestion) return res.status(201).json(fiche);
    next(new Error("Suggestion not found"));
  }
};
const getRefSuggestion = async ({
  responsibleId,
  sugCategoryId,
  serviceId,
  teamId,
  sugClassificationId = null,
}) => {
  const responsablesComite = await prisma.user.findMany({
    where: { isComityUser: true },
  });
  const responsable = await prisma.user.findUnique({
    where: { id: parseInt(responsibleId) },
  });
  const categorie = await prisma.sug_category.findUnique({
    where: { id: parseInt(sugCategoryId) },
  });
  const service = await prisma.service.findUnique({
    where: { id: parseInt(serviceId) },
  });
  const equipe = await prisma.team.findUnique({
    where: { id: parseInt(teamId) },
  });
  const classification = sugClassificationId
    ? await prisma.sugClassificationId.findUnique({
        where: { id: parseInt(sugClassificationId) },
      })
    : null;
  return {
    responsablesComite,
    responsable,
    categorie,
    service,
    equipe,
    classification,
  };
};
exports.createSuggestion = async (req, res, next) => {
  const {
    id_sug,
    senderFirstname,
    senderLastname,
    description,
    sugCategoryId,
    serviceId,
    teamId,
    responsibleId,
    imageNameOne,
    imageNameTwo,
    imageNameThree,
    lang,
  } = req.body;

  try {
    const { responsablesComite, responsable, categorie, service, equipe } =
      await getRefSuggestion({
        responsibleId,
        sugCategoryId,
        serviceId,
        teamId,
      });
    const createdSuggestion = await prisma.sug_suggestions.create({
      data: {
        id_sug,
        senderFirstname,
        senderLastname,
        description,
        sugCategory_id: sugCategoryId,
        service_id: parseInt(serviceId),
        team_id: parseInt(teamId),
        responsible_id: parseFloat(responsibleId),
        imageNameOne,
        imageNameTwo,
        imageNameThree,
      },
    });
    const buildMailData = () => {
      let defaultData = {
        firstname: "",
        lastname: "",
        ficheDate: id_sug,
        categorie: categorie.name,
        emetteur: `${senderFirstname} ${senderLastname}`,
        service: service.name,
        equipe: equipe.name,
        responsable: `${responsable.first_name} ${responsable.last_name}`,
        description: description,
        img1: imageNameOne ? SERVER_URL + imageNameOne : "",
        img2: imageNameTwo ? SERVER_URL + imageNameTwo : "",
        img3: imageNameThree ? SERVER_URL + imageNameThree : "",
        logo: "https://i.ibb.co/6b7J3j1/logo-sodigitale.png",
        email: "",
      };
      let tabToSend = [];
      /**On cree les donnees pour les responsables comite */
      if (responsablesComite && Array.isArray(responsablesComite)) {
        responsablesComite.forEach((respo) => {
          tabToSend.push({
            ...defaultData,
            firstname: respo.first_name,
            lastname: respo.last_name,
            email: respo.email,
          });
        });
      }
      /**On cree les donnees pour le responsable de la fiche ssi il n'est pas deja un responsable comite */
      if (
        tabToSend.filter((respo) => respo.email === responsable.email)
          .length === 0
      ) {
        tabToSend.push({
          ...defaultData,
          firstname: responsable.first_name,
          lastname: responsable.last_name,
          email: responsable.email,
        });
      }
      /**On utilise tabToSend pour chaque mail  */
      return tabToSend;
    };
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
    transporter.verify(function (error, success) {
      if (error) {
        console.log("transporter verify error", error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    buildMailData().forEach((respo) => {
      let attachments = [
          ...(respo?.img1 &&
                {
                  filename: respo.img1.split('/').at(-1),
                  path: respo.img1,
                  href: respo.img1,
                  cid: nanoid() + "@nodemailer.com",
                  contentType: "image/webp",
                }
          ),
          ...(respo?.img2 &&
                {
                  filename: respo.img2.split('/').at(-1),
                  path: respo.img2,
                  href: respo.img2,
                  cid: nanoid() + "@nodemailer.com",
                  contentType: "image/webp",
                }
          ),
        ...(respo?.img3 &&
            {
              filename: respo.img3.split('/').at(-1),
              path: respo.img3,
              href: respo.img3,
              cid: nanoid() + "@nodemailer.com",
              contentType: "image/webp",
            }
        ),
      ]
      const dataHtml = buildMailSug(respo, attachments, lang)
      const mailOptions = {
        from: MAIl_FROM,
        to: respo.email,
        subject: `${t(lang, "mail.sug2")} ${id_sug} ${t(lang, "mail.text28")}`,
        html: dataHtml,
        attachments: attachments,
        alternatives: [
          {
              contentType: 'text/html',
              content: dataHtml
          }
        ]
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Email sent error", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });

    res.status(201).json({ suggestion: createdSuggestion });
  } catch (error) {
    console.log("Add sugg error", error);
    next(new Error("Suggestion not created"));
  }
};

exports.addComityUser = async (req, res, next) => {
  const { userId } = req.body;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    next(new Error("User id not found"));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isComityUser: true },
  });

  res.status(201).json({ message: "Added comity user" });
};

exports.editComityUser = async (req, res, next) => {
  const { userId } = req.body;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  await prisma.user.updateMany({
    where: { isComityUser: true },
    data: { isComityUser: false },
  });

  if (!user) {
    next(new Error("User id not found"));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isComityUser: true },
  });

  res.status(201).json({ message: "Replaced comity user" });
};

exports.updateSuggestion = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const {
    senderFirstname,
    senderLastname,
    description,
    sugCategoryId,
    sugClassificationId,
    serviceId,
    teamId,
    responsibleId,
    imageNameOne,
    imageNameTwo,
    imageNameThree,
    statusValidatedResponsible,
    statusValidatedComity,
    commentResponsible,
    commentComity,
    lang,
  } = req.body;

  const existingSuggestion = await prisma.sug_suggestions.findUnique({
    where: { id },
  });

  if (!existingSuggestion) {
    res.status(400).json({ error: "Suggestion does not exist" });
  }
  const existingRef = await getRefSuggestion({
    responsibleId: existingSuggestion.responsible_id,
    sugCategoryId: existingSuggestion.sugCategory_id,
    serviceId: existingSuggestion.service_id,
    teamId: existingSuggestion.team_id,
  });
  const existingResponsable = existingRef.responsable;
  const existingCategorie = existingRef.categorie;
  const existingService = existingRef.service;
  const existingEquipe = existingRef.equipe;
  try {
    const updatedSuggestion = await prisma.sug_suggestions.update({
      include: { statusWorkflow: true },
      where: { id },
      data: {
        senderFirstname,
        senderLastname,
        description,
        sugCategory_id: sugCategoryId,
        sugClassification_id:
          sugClassificationId !== 0 ? sugClassificationId : undefined,
        service_id: parseInt(serviceId),
        team_id: parseInt(teamId),
        responsible_id: parseFloat(responsibleId),
        imageNameOne,
        imageNameTwo,
        imageNameThree,
      },
    });
    const {
      responsablesComite,
      responsable,
      categorie,
      service,
      equipe,
      classification,
    } = await getRefSuggestion({
      responsibleId,
      sugCategoryId,
      serviceId,
      teamId,
      sugClassificationId,
    });

    const buildMailData = () => {
      let defaultData = {
        firstname: "",
        lastname: "",
        ficheDate: updatedSuggestion.id_sug,
        categorie: existingCategorie.name,
        categorieNew: categorie.name,
        emetteur: `${existingSuggestion.senderFirstname} ${existingSuggestion.senderLastname}`,
        emetteurNew: `${senderFirstname} ${senderLastname}`,
        service: existingService.name,
        serviceNew: service.name,
        equipe: existingEquipe.name,
        equipeNew: equipe.name,
        responsable: `${existingResponsable.first_name} ${existingResponsable.last_name}`,
        responsableNew: `${responsable.first_name} ${responsable.last_name}`,
        description: existingSuggestion.description,
        descriptionNew: description,
        classification: classification.name,
        statusValidatedResponsible: statusValidatedResponsible
          ? "Valider"
          : "Refuser",
        statusValidatedComity: statusValidatedComity ? "Valider" : "Refuser",
        commentResponsible: commentResponsible ? commentResponsible : "",
        commentComity: commentComity ? commentComity : "",
        img1: updatedSuggestion.imageNameOne
          ? SERVER_URL + updatedSuggestion.imageNameOne
          : "",
        img2: updatedSuggestion.imageNameTwo
          ? SERVER_URL + updatedSuggestion.imageNameTwo
          : "",
        img3: updatedSuggestion.imageNameThree
          ? SERVER_URL + updatedSuggestion.imageNameThree
          : "",
        logo: "https://i.ibb.co/6b7J3j1/logo-sodigitale.png",
        email: "",
      };
      let tabToSend = [];
      /**On cree les donnees pour les responsables comite */
      if (responsablesComite && Array.isArray(responsablesComite)) {
        responsablesComite.forEach((respo) => {
          tabToSend.push({
            ...defaultData,
            firstname: respo.first_name,
            lastname: respo.last_name,
            email: respo.email,
          });
        });
      }
      /**On cree les donnees pour le responsable de la fiche ssi il n'est pas deja un responsable comite */
      if (
        tabToSend.filter((respo) => respo.email === responsable.email)
          .length === 0
      ) {
        tabToSend.push({
          ...defaultData,
          firstname: responsable.first_name,
          lastname: responsable.last_name,
          email: responsable.email,
        });
      }
      /**On utilise tabToSend pour chaque mail  */
      return tabToSend;
    };
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
    const MailData = buildMailData();

    transporter.verify(function (error, success) {
      if (error) {
        console.log("transporter verify error", error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    for (let i = 0; i < MailData.length; i++) {
      let attachments = [
        {
          filename: MailData[i].img1.split('/').at(-1),
          path: MailData[i].img1,
          href: MailData[i].img1,
          cid: nanoid() + "@nodemailer.com",
          contentType: "image/webp",
        },
        {
          filename: MailData[i].img2.split('/').at(-1),
          path: MailData[i].img2,
          href: MailData[i].img2,
          cid: nanoid() + "@nodemailer.com",
          contentType: "image/webp",
        },
        {
          filename: MailData[i].img3.split('/').at(-1),
          path: MailData[i].img3,
          href: MailData[i].img3,
          cid: nanoid() + "@nodemailer.com",
          contentType: "image/webp",
        }
      ]
      const dataHtml = buildMailSugUpdate(MailData[i], attachments, lang)
      const mailOptions = {
        from: MAIl_FROM,
        to: MailData[i].email,
        subject: `${t(lang, "mail.sug2")} ${ficheDate} ${t(
          lang,
          "mail.text27"
        )}`,
        html: dataHtml,
        attachments: attachments,
        alternatives: [
          {
              contentType: 'text/html',
              content: dataHtml
          }
        ]
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Email sent error", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    res.status(201).json({
      suggestion: updatedSuggestion,
    });
  } catch (error) {
    console.log("Update sugg error", error);
    next(new Error("Suggestion not updated"));
  }
};

exports.uploadSuggestionImage = async (req, res, next) => {
  if (req.files?.image) {
    const image = req.files.image;

    const splitName = image.name.split(".");
    const uniqueId = `${nanoid()}`;
    const uploadPathUser = `/images/suggestion/${uniqueId}.webp`;
    const uploadPathDisk =
      process.cwd() +
      `/public/images/suggestion/${uniqueId}.${
        splitName[splitName.length - 1]
      }`;

    image.mv(uploadPathDisk, async function (err) {
      if (err) {
        next(new Error("Error uploading image"));
      }
      const finalPath = process.cwd() + "/public" + uploadPathUser;
      await imageConverter(uploadPathDisk, finalPath)
        .then(() => {
          unlink(uploadPathDisk, (err) => {
            if (err) {
              next(new Error("File not found to delete"));
            }
          });
        })
        .catch((err) => {
          console.log("uploadsugimg error", err);
          return res.status(500).send(err);
        });
    });

    res.status(201).json({ image: uploadPathUser });
  } else {
    next(new Error("Image missing"));
  }
};

exports.removeSuggestionImage = async (req, res, next) => {
  if (req.body.imageName) {
    const path = process.cwd() + "/public" + req.body.imageName;
    unlink(path, (err) => {
      if (err) {
        next(new Error("File not found to delete"));
      }
    });
    res.status(201).json({ message: "Image removed" });
  } else {
    next(new Error("Image name not given"));
  }
};
