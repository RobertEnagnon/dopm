import {Category} from "../../models/Top5/category";
import RequestService from "../request";
import {GetIndicatorsByCategory} from "./indicator";

const GetCategoriesByBranch = async ( branchId: number, getColor: boolean = false ) => {
    let categories: Array<Category> = [];

    let req = new RequestService()
    const res = await req.fetchEndpoint( `categories/${branchId}` )
    if( res )
        for (const data of res.data) {
            let color = 'warning';
            if( getColor ) {
                let indicators = await GetIndicatorsByCategory( data.id, true );
                if( indicators ) {
                    categories.push({
                        id: data.id,
                        name: data.name,
                        orderCategory: data.orderCategory,
                        indicator: indicators,
                        color: indicators[0] ? indicators[0].color : 'warning'
                    })
                }
            } else {
                categories.push({
                    id: data.id,
                    name: data.name,
                    orderCategory: data.orderCategory,
                    indicator: data.indicator,
                    color: color
                })
            }
        }

    return categories;
}

const CreateCategory = async ( data: Category ) => {
    let req = new RequestService()
    const res = await req.fetchEndpoint( `categories`, 'POST', data )
    return res;
}

const UpdateCategory = async ( data: Category ) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint( `categories/${data.id}`, 'PUT', data )
    return res;
}

const DeleteCategory = async ( category: Category ) => {
    let req = new RequestService()
    return await req.fetchEndpoint(`categories/${category.id}`, 'DELETE')
}

export {
    GetCategoriesByBranch,
    CreateCategory,
    UpdateCategory,
    DeleteCategory
}
