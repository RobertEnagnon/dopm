const { PrismaClient } = require('@prisma/client');
const {nanoid} = require('nanoid')
const {fileNameParser} = require('../../utils/imageConverter')
const fs = require('fs')
const prisma = new PrismaClient();

exports.createTaskFile = async (req, res, next) => {
    console.log('createTaskFile');

    const { taskId } = req.params;
    const uploadedFile = req.files.sampleFile;

    if (!taskId) {
      return res.status(201).json({
        error: `createTaskFile : field missing`
      });
    }

    const suffix = nanoid()
    const nameParsed = fileNameParser(uploadedFile.name, suffix, false)
    const uploadPathToSave = "/images/asFile/" + nameParsed

    uploadedFile.mv(process.cwd() + "/public" + uploadPathToSave, async function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        prisma.as_file.create({
            data: {
                label: uploadedFile.name,
                path: uploadPathToSave,
                taskId: parseInt(taskId)
            }
        })
            .then(async newFile => {
                const file = await prisma.as_file.findUnique({
                    where: {
                        id: parseInt(newFile.id)
                    }
                });
                res.status(201).json({newFile : file});
            })
            .catch(error => {
                res.status(201).json({
                    error: `createTaskFile : ${error}`
                });
            })
    })
};

exports.deleteTaskFile = async (req, res, next) => {
    console.log('deleteTaskFile');

    const { id, taskId } = req.params;

    const researchFile = await prisma.as_file.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if( researchFile ) {
        fs.unlinkSync(process.cwd() + "/public" + researchFile.path)

        const deleteFile = await prisma.as_file.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(201).json({
            message: 'File deleted successfully!'
        });
    } else {
        res.status(400).json({
            error: 'Bad id'
        });
    }
}
