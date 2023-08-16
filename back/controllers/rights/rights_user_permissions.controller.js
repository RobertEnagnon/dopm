const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ajouter un Utilisateur à un groupe
exports.addPermissionToUser = async (req, res, next) => {
  console.log("addPermissionToUser")

  const userId = parseInt(req.params.user);
  const permissionId = parseInt(req.params.permission);
  const branchId = req.body.branchId || null;
  const categoryId = req.body.categoryId || null;
  const dashboardId = req.body.dashboardId || null;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if (!user) {
    return res.status(500).json({error: "User not existing"})
  }
  console.log('chosen user', user)

  const rightsPermission = await prisma.rights_permissions.findUnique({
    where: {
      id: permissionId,
    }
  })

  if (!rightsPermission) {
    return res.status(500).json({error: "Permission not existing"})
  }
  console.log('chosen group', rightsPermission)

  const newRightsUserPermission = await prisma.rights_user_permissions.create({
    data: {
      id_user: userId,
      id_permission: permissionId,
      id_branch: branchId,
      id_category: categoryId,
      id_dashboard: dashboardId
    }
  })
  if(!newRightsUserPermission) {
    return res.status(500).json({error: "User cannot be assign to this permission"})
  }
  res.status(201).json({message: "Created successfully!", newRightsUserPermission})
};

// Vérifie les permissions d'un utilisateur
exports.checkUserPermission = async (req, res, next) => {
  console.log("checkUserPermission")

  const userId = parseInt(req.userId);
  const permissionId = parseInt(req.params.permission);
  const branchId = req.body.branchId || null;
  const categoryId = req.body.categoryId || null;
  const global = req.body.global || false;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if (!user) {
    return res.status(500).json({error: "User not existing"})
  }
  console.log('chosen user', user)

  const rightsPermission = await prisma.rights_permissions.findUnique({
    where: {
      id: permissionId,
    }
  })

  if (!rightsPermission) {
    return res.status(500).json({error: "Permission not existing"})
  }
  console.log('chosen permission', rightsPermission)

  // Test du cas où l'utilisateur fait partie d'un groupe ayant le droit.
  const rightGroupsPermitted = await prisma.rights_groupes_permissions.findMany({
    where: {
      id_permission: permissionId
    }
  })
  console.log('rightGroupsPermitted', rightGroupsPermitted, userId)

  const isUserInThesesGroups = await prisma.rights_user_groupes.findMany({
    where: {
      OR: rightGroupsPermitted.map(rgp => ({
        id_user: userId,
        id_groupe: rgp.id_groupe
      }))
    }
  })

  console.log('isUserInThesesGroups', isUserInThesesGroups)

  if (isUserInThesesGroups.length) {
    return res.status(200).json({ permission: true })
  }

  if (global) {
    const dataWhere = {
      id_user: userId,
      id_permission: permissionId,
    }
    if (branchId) {
      dataWhere.id_branch = branchId
    }
    if (categoryId) {
      dataWhere.id_category = categoryId
    }
    console.log('we are in global scope', dataWhere)
    let userHasSpecificPermission = await prisma.rights_user_permissions.findMany({
      where: dataWhere
    })
    return res.status(200).json({ permission: !!userHasSpecificPermission.length })
  }

  // Test de droits spécifiques si l'utilisateur n'est pas dans un groupe ayant le droit.
  let userHasSpecificPermission = await prisma.rights_user_permissions.findMany({
    where: {
      id_user: userId,
      id_permission: permissionId,
      id_branch: null,
      id_category: null
    }
  })

  console.log('userHasSpecificPermission 1', userHasSpecificPermission)

  if (userHasSpecificPermission.length)
  {
    return res.status(200).json({ permission: !!userHasSpecificPermission.length })
  }

  userHasSpecificPermission = await prisma.rights_user_permissions.findMany({
    where: {
      id_user: userId,
      id_permission: permissionId,
      id_branch: branchId,
      id_category: null
    }
  })

  console.log('userHasSpecificPermission 2', userHasSpecificPermission)

  if (userHasSpecificPermission.length)
  {
    return res.status(200).json({ permission: !!userHasSpecificPermission.length })
  }

  userHasSpecificPermission = await prisma.rights_user_permissions.findMany({
    where: {
      id_user: userId,
      id_permission: permissionId,
      id_branch: branchId,
      id_category: categoryId
    }
  })

  console.log('userHasSpecificPermission 3', userHasSpecificPermission)

  return res.status(200).json({ permission: !!userHasSpecificPermission.length })
};

// Supprime un Utilisateur d'un groupe
exports.deletePermissionFromUser = async (req, res, next) => {
  console.log("deletePermissionFromUser")

  const userId = parseInt(req.params.user);
  const upId = parseInt(req.params.upId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if (!user) {
    return res.status(500).json({error: "User not existing"})
  }

  const permission = await prisma.rights_user_permissions.findMany({
    where: {
      id: upId,
      id_user: userId
    }
  })

  if (!permission.length) {
    return res.status(500).json({error: "Permission not existing"})
  }
  console.log('chosen permission', permission)

  const deletePermission = await prisma.rights_user_permissions.delete({
    where: {
      id: upId
    }
  })
  if(!deletePermission) {
    return res.status(500).json({error: "User cannot be assign to this group"})
  }
  res.status(201).json({message: "Deleted successfully!"})
};
