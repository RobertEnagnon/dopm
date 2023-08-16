import moment from "moment";
import RequestService from "./request";
import type { UserData } from '../models/user'

const GetLanguages = async () => {
    let language: [] = [];
    let req = new RequestService();
    await req.fetchEndpoint(`languages`)
        .then(res => {
            if (res?.data && res.data.length > 0) {
                res.data.forEach((element: never) => {
                    language.push(element)
                });
            }
        })

    return language;

}

const AllLanguage = () => {
    let data: string[] = [];
    GetLanguages().then((res) => {
        console.log(res);
        data = res;

    });
    return data;
}
const GetUsers = async () => {
    let users: Array<UserData> = [];

    let req = new RequestService();
    await req.fetchEndpoint(`users/all`)
        .then(res => {
            if (res?.data && res.data.length > 0) {
                res.data.forEach((user: UserData) => {
                    if (user.language[0])
                        users.push({
                            id: user.id,
                            // @ts-ignore
                            lastname: user.last_name,
                            // @ts-ignore
                            firstname: user.first_name,
                            email: user.email,
                            // @ts-ignore
                            function: user.fonction,
                            username: user.username,
                            createdAt: moment(user.createdAt).toDate(),
                            updatedAt: moment(user.updatedAt).toDate(),
                            service: user.service,
                            // @ts-ignore
                            roles: user.role[0].roleId === 2 ? "admin" : "user",
                            language: user.language[0],
                            url: user.url,
                            isComityUser: user.isComityUser,
                            isResponsible: user.isResponsible,
                            groupes: user.groupes,
                            permissions: user.permissions
                        })
                })

            }
        })

    return users;

}

const CreateUser = async (data: UserData) => {
    const userToCreate: any = {
        id: data.id,
        last_name: data.lastname,
        first_name: data.firstname,
        fonction: data.function,
        createdAt: new Date(),
        username: data.username,
        email: data.email,
        serviceId: data.service?.id,
        roles: data.roles,
        password: data.password,
        language: data.language,
    };

    let req = new RequestService();
    const res = req.fetchEndpoint(`users`, 'POST', userToCreate)
    return res;
}

const UpdateUser = async (data: UserData) => {
    const userToUpdate: any = {
        last_name: data.lastname,
        first_name: data.firstname,
        fonction: data.function,
        createdAt: new Date(),
        username: data.username,
        email: data.email,
        serviceId: data.service?.id,
        roles: data.roles,
        language: data.language,
        isResponsible: data.isResponsible
    };

    let req = new RequestService();
    const res = await req.fetchEndpoint(`users/${data.id}`, "PUT", userToUpdate);
    return res;
};

const DeleteUser = async (userId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`users/${userId}`, "DELETE");
};

const AddUserGroup = async (userId: number, groupId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`users/${userId}/group/${groupId}`, 'POST');
}

const DeleteUserGroup = async (userId: number, groupId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`users/${userId}/group/${groupId}`, 'DELETE');
}

const AddSpecificPermission = async (userId: number, permissionId: number, branchId: number, categoryId: number, dashboardId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`users/${userId}/permission/${permissionId}`, 'POST', { categoryId, branchId, dashboardId });
}

const DeleteSpecificPermission = async (userId: number, permissionId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`users/${userId}/permission/${permissionId}`, 'DELETE');
}

const CheckPermission = async (permissionId: number, branchId?: number, categoryId?: number, global?: boolean) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`users/check_permission/${permissionId}`, "POST", { branchId, categoryId, global });
}

const RefreshRights = async () => {
    let req = new RequestService();
    return await req.fetchEndpoint("auth/refreshRights");
}

const UpdateResponsible = async (user: UserData, isResponsible: boolean) => {
    return await UpdateUser({ ...user, isResponsible: isResponsible ? 1 : 0 });
}

export const UpdateProfilePicture = async (userId: number, file: File) => {
    let req = new RequestService();
    const formData = new FormData();
    formData.append('sampleFile', file);
    return await req.fetchEndpoint(`auth/imgProfile/${userId}`, 'POST', formData, false);
}

export {
    AllLanguage,
    GetLanguages,
    GetUsers,
    CreateUser,
    UpdateUser,
    DeleteUser,
    AddUserGroup,
    DeleteUserGroup,
    AddSpecificPermission,
    DeleteSpecificPermission,
    CheckPermission,
    RefreshRights,
    UpdateResponsible
}
