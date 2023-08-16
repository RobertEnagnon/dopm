import {Group} from "../models/Right/group";
import RequestService from "./request";
import {pascalCase} from "../utils/dopm.utils";

const GetGroupes = async () => {
    let groupes: Array<Group> = []

    let req = new RequestService();
    await req.fetchEndpoint( 'rights_groupes' )
    .then(res => {
        if(res?.data && res.data.length > 0) {
            pascalCase(res.data).forEach((group: Group) => {
                groupes.push({
                    id: group.id,
                    name: group.name,
                    rightsGroupesPermissions: group.rightsGroupesPermissions
                })
            })
        }
    })

    return groupes
}

const CreateGroup = async (data: Group) => {
    const groupToCreate = {
        name: data.name
    }
    let req = new RequestService();
    return await req.fetchEndpoint(`rights_groupes`, 'POST', groupToCreate)
}

const DeleteGroup = async (groupId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`rights_groupes/${groupId}`, "DELETE");
}

const UpdateGroup = async (id: number, name: string) => {
    const groupToUpdate = {
        name
    }
    let req = new RequestService();
    return await req.fetchEndpoint(`rights_groupes/${id}`, "PUT", groupToUpdate);
}

const AddPermission = async (idGroupe: number, idPermission: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint('rights_groupes_permissions', "POST", {idGroupe, idPermission})
}

const DeletePermission = async (idGroupe: number, idPermission: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint('rights_groupes_permissions', "DELETE", {idGroupe, idPermission})
}

export {
    GetGroupes,
    CreateGroup,
    DeleteGroup,
    UpdateGroup,
    AddPermission,
    DeletePermission
}