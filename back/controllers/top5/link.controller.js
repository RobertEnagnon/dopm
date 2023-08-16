const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//manque UPDATE
exports.updateLink = (req, res, next) => {};

//manque DELETE
exports.deleteLink = (req, res, next) => {};

exports.createLink = (req, res, next) => {
  const link = prisma.link.create({
    data: {
        id: req.body.id,
        title: req.body.title,
        link: req.body.link,
        category_id: req.body.category_id,
    },
  }).then(
    () => {
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    }).catch(
        (error) => {
          res.status(400).json({
                error: "CreateLink : " + error
            });
        }
    );
};

exports.getOneLink = (req, res, next) => {
    const link = prisma.link.findUnique({
        where: {
            id: parseInt(req.params.id, 10)
        }
    }).then(
        (link) => {
            res.status(200).json(link)
        }).catch(
        (error) => {
            res.status(400).json({
                error: "GetOneLink : " + error
            });
        }
    );
};


exports.getAllLink = (req, res, next) => {
  const link = prisma.link.findMany().then(
    (link) => {
        res.status(201).json(link);
    }).catch(
        (error) => {
          res.status(400).json({
                error: "GetAllLink : " + error
            });
        }
    );
};
