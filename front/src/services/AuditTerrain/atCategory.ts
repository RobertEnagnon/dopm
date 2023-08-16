import RequestService from "../request";
import {AtCategory} from "../../models/AuditTerrain/atCategory";

const GetATCategories = async () => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('audit-categories');
    return res?.data.map((atcategory: AtCategory) => ({
        ...atcategory,
        createdAt: new Date(atcategory.createdAt),
        updatedAt: new Date(atcategory.updatedAt)
    }));
}

const AddATCategory = async (atcategory: AtCategory) => {
    let req = new RequestService();
    let user = JSON.parse( localStorage.getItem('user')! );

    const res = await req.fetchEndpoint('audit-categories', 'POST', {...atcategory, user});
    const newATCategory = res?.data.newATCategory;
    return {
        ...newATCategory,
        updatedAt: new Date(newATCategory.updatedAt),
        createdAt: new Date(newATCategory.createdAt)
    };
}

const UpdateATCategory = async (id: number, atCategory: AtCategory) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`audit-categories/${id}`, 'PUT', atCategory);
}

const DeleteATCategory = async (id: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`audit-categories/${id}`, 'DELETE');
    return res?.data
}

export {
    GetATCategories,
    AddATCategory,
    UpdateATCategory,
    DeleteATCategory
}