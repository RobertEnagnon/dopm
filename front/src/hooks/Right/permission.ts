import {useEffect, useState} from "react";
import {GetPermissions, CreatePermission, UpdatePermission, DeletePermission} from "../../services/permission";
import {Permission} from "../../models/Right/permission";
import {notify, NotifyActions} from "../../utils/dopm.utils";

export const usePermission = () => {
  const [ permissions, setPermissions ] = useState<Array<Permission>>();

  useEffect(() => {
    FetchPermissions()
  }, [])

  const FetchPermissions = async () => {
    const permissions = await GetPermissions();
    setPermissions(permissions);
    return permissions;
  }

  const createPermission = async (permission: Permission) => {
    const res = await CreatePermission(permission);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Permission ${permission.name} created !`, NotifyActions.Successful)
      setPermissions(permissions?.concat(res?.data.rightsPermission))
    }
  }

  const updatePermission = async (id: number, name: string) => {
    const res = await UpdatePermission(id, name);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Permission renamed !`, NotifyActions.Successful)
      setPermissions(permissions?.map(permission => {
        if (permission.id === id) {
          permission.name = name;
        }
        return permission;
      }))
    }
  }

  const deletePermission = async (id: number) => {
    const res = await DeletePermission(id);
    if (res?.data.error) {
      notify(res.data.error, NotifyActions.Error)
    } else {
      notify(`Permission ${id} deleted !`, NotifyActions.Successful)
      setPermissions(permissions?.filter(permission => permission.id !== id))
    }
  };

  return { permissions, createPermission, updatePermission, deletePermission };
}