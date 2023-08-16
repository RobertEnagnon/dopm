import { Permission } from "../models/Right/permission";
import RequestService from "./request";

const GetPermissions = async () => {
    let permissions: Array<Permission> = []

    let req = new RequestService();
    await req.fetchEndpoint('rights_permissions')
    .then( res => {
        if(res?.data && res.data.length > 0) {
            res.data.forEach((permission: Permission) => {
                permissions.push({
                    id: permission.id,
                    name: permission.name,
                })
            })
        }
    })

    return permissions
}

const CreatePermission = async (data: Permission) => {
    const permissionToCreate = {
        name: data.name
    }
    let req = new RequestService();
    return await req.fetchEndpoint(`rights_permissions`, 'POST', permissionToCreate)
}

const UpdatePermission = async (id: number, name: string) => {
  const permissionToUpdate = {
    name
  }
  let req = new RequestService();
  return await req.fetchEndpoint(`rights_permissions/${id}`, "PUT", permissionToUpdate);
}

const DeletePermission = async (permissionId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`rights_permissions/${permissionId}`, "DELETE");
}

export {
    GetPermissions,
    CreatePermission,
    UpdatePermission,
    DeletePermission
}