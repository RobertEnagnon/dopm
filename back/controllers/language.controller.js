const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createLanguage = (req, res, next) => {
  console.log(req.body)
  const language = prisma.languages.create({
    data: {
      id: req.body.id,
      name: req.body.name,
    },
  }).then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }).catch(
      (error) => {
        res.status(400).json({
          error: "CreateLanguage : " + error
        });
      }
    );
};
exports.getAllLanguage = (req, res, next) => {
  const languages = prisma.languages.findMany()
    .then(
      (languages) => {
        res.status(201).json(languages)
      }).catch(
        (error) => {
          res.status(400).json({
            error: "GetAlllanguages : " + error
          });
        }
      );
};