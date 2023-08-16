import {useEffect, useState} from "react";
import {CreateGroup, DeleteGroup, GetGroupes, UpdateGroup, AddPermission, DeletePermission} from "../../services/group";
import {Group} from "../../models/Right/group";
import {notify, NotifyActions} from "../../utils/dopm.utils";

export const useGroup = () => {
  const [ groupes, setGroupes ] = useState<Array<Group>>();

  useEffect(() => {
    FetchGroupes()
  }, [])

  const FetchGroupes = async () => {
    const groupes = await GetGroupes();
    setGroupes(groupes);
    return groupes;
  }

  const createGroup = async (group: Group) => {
    const res = await CreateGroup(group);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Group ${group.name} created !`, NotifyActions.Successful)
      setGroupes(groupes?.concat(res?.data.rightsGroupe))
    }
  }

  const updateGroup = async (id: number, name: string) => {
    const res = await UpdateGroup(id, name);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Group renamed !`, NotifyActions.Successful)
      setGroupes(groupes?.map(g => {
        if (g.id === id) {
          g.name = name;
        }
        return g;
      }))
    }
  }

  const deleteGroup = async (id: number) => {
    const res = await DeleteGroup(id);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Group ${id} deleted !`, NotifyActions.Successful)
      setGroupes(groupes?.filter(group => group.id !== id))
    }
  };

  const addPermission = async (idGroupe: number, idPermission: number) => {
    const res = await AddPermission(idGroupe, idPermission);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Permission added !`, NotifyActions.Successful)
      setGroupes(groupes?.map(group => {
        if (group.id === idGroupe) {
          group.rightsGroupesPermissions = group.rightsGroupesPermissions.concat({idGroupe, idPermission})
        }
        return group
      }))
    }
  }

  const deletePermission = async (idGroupe: number, idPermission: number) => {
    const res = await DeletePermission(idGroupe, idPermission);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Permission deleted !`, NotifyActions.Successful)
      setGroupes(groupes?.map(group => {
        if (group.id === idGroupe) {
          group.rightsGroupesPermissions = group.rightsGroupesPermissions.filter(rgp => rgp.idPermission !== idPermission)
        }
        return group
      }))
    }
  }

  return { groupes, createGroup, updateGroup, deleteGroup, addPermission, deletePermission };
}