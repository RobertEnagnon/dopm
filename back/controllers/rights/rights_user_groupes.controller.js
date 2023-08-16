const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ajouter un Utilisateur à un groupe
exports.addUserToGroup = async (req, res, next) => {
  console.log("addUserToGroup")

  const userId = parseInt(req.params.user);
  const groupId = parseInt(req.params.group);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if (!user) {
    return res.status(500).json({error: "User not existing"})
  }
  console.log('chosen user', user)

  const rightsGroup = await prisma.rights_groupes.findUnique({
    where: {
      id: groupId,
    }
  })

  if (!rightsGroup) {
    return res.status(500).json({error: "Group not existing"})
  }
  console.log('chosen group', rightsGroup)

  const newRightsUserGroup = await prisma.rights_user_groupes.create({
    data: {
      id_user: userId,
      id_groupe: groupId
    }
  })
  if(!newRightsUserGroup) {
    return res.status(500).json({error: "User cannot be assign to this group"})
  }
  res.status(201).json({message: "Created successfully!"})
};

// Supprime un Utilisateur d'un groupe
exports.deleteUserFromGroup = async (req, res, next) => {
  console.log("deleteUserFromGroup")

  const userId = parseInt(req.params.user);
  const groupId = parseInt(req.params.group);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if (!user) {
    return res.status(500).json({error: "User not existing"})
  }
  console.log('chosen user', user)

  const rightsGroup = await prisma.rights_groupes.findUnique({
    where: {
      id: groupId,
    }
  })

  if (!rightsGroup) {
    return res.status(500).json({error: "Group not existing"})
  }
  console.log('chosen group', rightsGroup)

  const newRightsUserGroup = await prisma.rights_user_groupes.delete({
    where: {
      id_user_id_groupe: {
        id_user: userId,
        id_groupe: groupId
      }
    }
  })
  if(!newRightsUserGroup) {
    return res.status(500).json({error: "User cannot be assign to this group"})
  }
  res.status(201).json({message: "Deleted successfully!"})
};
