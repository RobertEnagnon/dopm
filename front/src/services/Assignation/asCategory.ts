import RequestService from "../request";
import {AsCategory} from "../../models/Assignation/asCategory";

const GetASCategories = async (asBoardId: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_categories?asBoardId=${asBoardId}`);
    return res?.data.map((ascategory: AsCategory) => ({
        ...ascategory,
        createdAt: new Date(ascategory.createdAt),
        updatedAt: new Date(ascategory.updatedAt)
    }));
}

const AddASCategory = async (ascategory: AsCategory, asBoardId: number) => {
    let req = new RequestService();
    let user = JSON.parse( localStorage.getItem('user')! );

    const res = await req.fetchEndpoint('as_categories', 'POST', {...ascategory, user, asBoardId});
    const newASCategory = res?.data.newASCategory;
    return {
        ...newASCategory,
        updatedAt: new Date(newASCategory.updatedAt),
        createdAt: new Date(newASCategory.createdAt)
    };
}

const UpdateASCategory = async (id: number, asCategory: AsCategory) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`as_categories/${id}`, 'PUT', asCategory);
}

const DeleteASCategory = async (id: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_categories/${id}`, 'DELETE');
    return res?.data
}

export {
    GetASCategories,
    AddASCategory,
    UpdateASCategory,
    DeleteASCategory
}