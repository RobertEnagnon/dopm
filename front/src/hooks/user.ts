import { useEffect, useState } from "react";
import { UserData } from "../models/user";
import {
  GetUsers,
  AddUserGroup,
  DeleteUserGroup,
  AddSpecificPermission,
  DeleteSpecificPermission,
  UpdateResponsible,
} from "../services/user";
import { Group } from "../models/Right/group";

export const useUser = () => {
  const [users, setUsers] = useState<Array<UserData>>();

  useEffect(() => {
    FetchUsers();
  }, []);

  const FetchUsers = async () => {
    const users = await GetUsers();
    setUsers(sortUsers(users));
    return users;
  };

  const sortUsers = (array: Array<UserData>) => {
    return array.sort((a, b) => {
      if (a.lastname?.trim()?.toLowerCase() < b.lastname?.trim()?.toLowerCase()) {
        return -1;
      } else if (a.lastname?.trim()?.toLowerCase() > b.lastname?.trim()?.toLowerCase()) {
        return 1;
      } else if (a.firstname?.trim()?.toLowerCase() < b.firstname?.trim()?.toLowerCase()) {
        return -1;
      } else if (a.firstname?.trim()?.toLowerCase() > b.firstname?.trim()?.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  const usersResponsible = users?.some((user) => user.isResponsible === 1) && sortUsers(users?.filter((user) => user.isResponsible === 1));

  const addUserGroup = async (userId: number, group: Group) => {
    await AddUserGroup(userId, group.id);
    setUsers(
      sortUsers(users?.map((user) =>
        user.id !== userId
          ? user
          : {
            ...user,
            groupes: user.groupes.concat({
              id_groupe: group.id,
              id_user: userId,
            }),
          }
      ) || [])
    );
  };

  const deleteUserGroup = async (userId: number, group: Group) => {
    await DeleteUserGroup(userId, group.id);
    setUsers(
      sortUsers(users?.map((user) =>
        user.id !== userId
          ? user
          : {
            ...user,
            groupes: user.groupes.filter((g) => g.id_groupe !== group.id),
          }
      ) || []
      ));
  };

  const addSpecificPermission = async (
    userId: number,
    permissionId: number,
    branchId: number,
    categoryId: number,
    dashboardId: number
  ) => {
    const res = await AddSpecificPermission(
      userId,
      permissionId,
      branchId,
      categoryId,
      dashboardId
    );
    setUsers(
      sortUsers(users?.map((user) =>
        user.id !== userId
          ? user
          : {
            ...user,
            permissions: user.permissions.concat({
              id: res?.data.newRightsUserPermission.id,
              id_user: userId,
              id_permission: permissionId,
              id_branch: branchId,
              id_category: categoryId,
              id_dashboard: dashboardId
            }),
          }
      ) || []
      ));
  };

  const deleteSpecificPermission = async (
    userId: number,
    permissionId: number
  ) => {
    await DeleteSpecificPermission(userId, permissionId);
    setUsers(
      sortUsers(users?.map((user) =>
        user.id !== userId
          ? user
          : {
            ...user,
            permissions: user.permissions.filter(
              (permission) => permission.id !== permissionId
            ),
          }
      ) || [])
    );
  };

  const updateUsersList = (users: Array<UserData>) => {
    setUsers(sortUsers(users));
  };

  const updateResponsible = async (user: UserData, isResponsible: boolean) => {
    await UpdateResponsible(user, isResponsible);
    setUsers(
      sortUsers(users?.map((currentUser) => {
        if (currentUser.id === user.id) {
          currentUser.isResponsible = isResponsible ? 1 : 0;
        }
        return currentUser;
      }) || [])
    );
  };

  return {
    users,
    usersResponsible,
    updateUsersList,
    addUserGroup,
    deleteUserGroup,
    addSpecificPermission,
    deleteSpecificPermission,
    updateResponsible
  };
};
