const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les responsables
exports.getAllResponsibles = async (req, res, next) => {
  const responsible = await prisma.user
    .findMany({
      where: {
        isResponsible: 1,
      }
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllResponsibles : " + error,
      });
    });
};

// Récupérer un seule responsable (id)
exports.getOneResponsible = async (req, res, next) => {
  const responsible = await prisma.user
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
        isResponsible: 1,
      },
    })
    .then((responsible) => {
      res.status(201).json(responsible);
    })
    .catch((error) => {
      res.status(200).json({
        error: "getOneResponsible : " + error,
      });
    });
};

// Récupérer un seule responsable (email)
exports.getOneResponsibleByEmail = async (req, res, next) => {
  const responsible = await prisma.user
    .findUnique({
      where: {
        email: req.params.email,
        isResponsible: 1,
      },
    })
    .then((responsible) => {
      res.status(201).json(responsible);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneResponsibleByEmail : " + error,
      });
    });
};

// // Créer un responsable
// exports.createResponsible = async (req, res, next) => {
//   let firstName = req.body.firstname;
//   let lastName = req.body.lastname;
//   let email = req.body.email;
//   firstName = firstName.trim();
//   lastName = lastName.trim();
//   email = email.trim();
//
//   const responsibleResearch = await prisma.responsible.findUnique({
//     where: {
//       email: email,
//     },
//   });
//
//   if (!responsibleResearch) {
//     const newResponsible = await prisma.responsible.create({
//       data: {
//         firstname: firstName,
//         lastname: lastName,
//         email: email,
//       },
//     });
//     if (newResponsible) {
//       const responsible = await prisma.responsible.findUnique({
//         where: {
//           email: email,
//         },
//       });
//
//       console.log("Responsible added");
//       //   console.log(responsible);
//       res.status(201).json({ responsible: responsible });
//     }
//   } else {
//     res.status(400).json({ error: "Responsible lastname already taken" });
//   }
// };
//
// // Modifier un responsable (id)
// exports.updateResponsible = async (req, res, next) => {
//   console.log("updateResponsible");
//
//   let firstName = req.body.firstname;
//   let lastName = req.body.lastname;
//   let email = req.body.email;
//
//   //   console.log(req.body);
//
//   const researchResponsible = await prisma.responsible.findUnique({
//     where: {
//       id: parseInt(req.params.id),
//     },
//   });
//   if (researchResponsible) {
//     const updateResponsible = await prisma.responsible
//       .update({
//         where: {
//           id: parseInt(req.params.id),
//         },
//         data: {
//           firstname: firstName,
//           lastname: lastName,
//           email: email,
//           updatedAt: new Date(),
//         },
//       })
//       .then(() => {
//         res.status(201).json({
//           message: "Responsible updated successfully!",
//         });
//       })
//       .catch((error) => {
//         res.status(400).json({
//           error: "Update Responsible : " + error,
//         });
//       });
//
//     // console.log(updateResponsible);
//   }
// };
//
// // Supprimer un responsable
// exports.deleteResponsible = async (req, res, next) => {
//   console.log("deleteResponsible");
//
//   const researchResponsible = await prisma.responsible.findUnique({
//     where: {
//       id: parseInt(req.params.id),
//     },
//   });
//   if (researchResponsible) {
//     const deleteResponsible = await prisma.responsible.delete({
//       where: {
//         id: parseInt(req.params.id),
//       },
//     });
//     res.status(201).json({
//       message: "Responsible deleted successfully!",
//     });
//   } else {
//     res.status(201).json({
//       error: "Bad Responsible id",
//     });
//   }
// };
