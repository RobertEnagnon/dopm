import { createContext, ReactNode, useContext, useState } from "react";
import { defaultUser, User } from "../../models/user";
import { RefreshRights } from "../../services/user";

type Props = {
    children: ReactNode;
}

type UserContextType = {
    currentUser: User,
    setCurrentUser: Function,
    checkToken: () => any,
    checkAccess: Function,
    isConnected: Boolean,
    setIsConnected: Function
}

const UserContextDefaultVaue: UserContextType = {
    currentUser: defaultUser,
    setCurrentUser: Function,
    checkToken: () => { },
    checkAccess: Function,
    isConnected: false,
    setIsConnected: Function
}

export const UserContext = createContext<UserContextType>(UserContextDefaultVaue);

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }: Props) {
    const [currentUser, setCurrentUser] = useState<User>(UserContextDefaultVaue.currentUser);
    const [isConnected, setIsConnected] = useState<Boolean>(false);

    const checkToken = async () => {
        console.log("Check Token")
        const localStorageUser = localStorage.getItem("user")
        if (localStorage.getItem("authToken") && localStorageUser && localStorageUser !== "") {
            const res = await RefreshRights()
            const user: User = JSON.parse(localStorageUser)
            user.permissions = res?.data.permissions
            setCurrentUser(user)
            setIsConnected(true);
            return true;
        }

        return false;
    }

    const checkAccess = (permissionId: number, branchId?: number, categoryId?: number, dashboardId?: number) => {
        if (!currentUser.permissions.length) {
          const permissions = JSON.parse(localStorage.getItem("user") || "").permissions
          return controlAccess(permissions, permissionId, branchId, categoryId, dashboardId)
        } else {
          return controlAccess(currentUser.permissions, permissionId, branchId, categoryId, dashboardId)
        }
    }

    const controlAccess = (permissions: Array<{ id: number, id_user: number, id_permission: number, id_branch: number, id_category: number, id_dashboard: number }>, permissionId: number, branchId?: number, categoryId?: number, dashboardId?: number) => {
      const isAllowed = permissions.some(permission => {
        if (dashboardId) {
          return permission.id_permission === permissionId
            && (permission.id_dashboard === dashboardId || permission.id_dashboard === null)
            && permission.id_branch === null
            && permission.id_category === null
        }
        if (categoryId) {
          return permission.id_permission === permissionId
            && (
              (permission.id_branch === branchId
                && (permission.id_category === categoryId)
                || (permission.id_branch === branchId
                  && (permission.id_category === null)))
              || (permission.id_branch === null
                && (permission.id_category === null))
            )
        }
        if (branchId) {
          return permission.id_permission === permissionId
            && (permission.id_branch === branchId || permission.id_branch === null)
        }
        return permission.id_permission === permissionId
          && permission.id_branch === null
          && permission.id_category === null
      })
      return isAllowed
    }


    const value = {
        currentUser: currentUser,
        setCurrentUser,
        checkToken,
        checkAccess,
        isConnected,
        setIsConnected
    };

    return (
        <>
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        </>
    )
}
