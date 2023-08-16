const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer une rightsPermission
exports.createRightsGroupePermission= async (req, res, next) => {
	console.log("createRightsGroupePermission")

	try {
		const newRightsGroupPermission = await prisma.rights_groupes_permissions.create({
			data: {
				id_groupe: req.body.idGroupe,
				id_permission: req.body.idPermission
			}
		})

		console.log("rightsGroupePermission added")
		res.status(201).json({ message: 'rightsGroupePermission added' })
	} catch(err) {
		res.status(201).json({
			error: 'Create rightsGroupePermission : ' + err
		});
	}
};

// Supprimer une rightsPermission (id)
exports.deleteRightsGroupePermission = async (req, res, next) => {
	console.log("deleteRightsGroupePermission")

	try {
		await prisma.rights_groupes_permissions.deleteMany({
			where: {
				id_groupe: req.body.idGroupe,
				id_permission: req.body.idPermission
			}
		})
		res.status(201).json({
			message: 'rightsGroupPermission deleted successfully!'
		})
	} catch (exception) {
		res.status(201).json({
			error: 'Delete rightsGroupPermission : ' + exception
		})
	}
}