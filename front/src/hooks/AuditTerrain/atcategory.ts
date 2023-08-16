import {useEffect, useState} from "react";
import {AtCategory} from "../../models/AuditTerrain/atCategory";
import {
    AddATCategory,
    DeleteATCategory,
    GetATCategories,
    UpdateATCategory
} from "../../services/AuditTerrain/atCategory";

export const useATCategory = () => {
    const [ atcategories, setATCategories ] = useState<Array<AtCategory>>([]);

    useEffect(() => {
        GetATCategories()
            .then(categories => {
                setATCategories(categories);
            });
    }, []);

    const addATCategory = async (atcategory: AtCategory) => {
        const newATCategory = await AddATCategory(atcategory);
        setATCategories(atcategories.concat(newATCategory));
        return newATCategory;
    }

    const updateATCategory = async (id: number, atcategory: AtCategory) => {
        await UpdateATCategory(id, atcategory);
        setATCategories(atcategories.map((atcat) => {
            if (atcat.id === id) {
                return {...atcat, ...atcategory};
            }
            return atcat;
        }));
        return atcategory;
    }

    const deleteATCategory = async (id: number) => {
        const res = await DeleteATCategory(id);
        if( res.message ) {
            setATCategories(atcategories.filter(atcategory => atcategory.id !== id));
        }
        return res;
    }

    return {
        atcategories,
        addATCategory,
        updateATCategory,
        deleteATCategory
    };
}