import { AsCategory } from "../../models/Assignation/asCategory";
import {useEffect, useState} from "react";
import {
    AddASCategory,
    DeleteASCategory,
    GetASCategories,
    UpdateASCategory
} from "../../services/Assignation/asCategory";
import { useParams } from "react-router-dom";


export const useASCategory = () => {
    const params = useParams();
    const [ ascategories, setASCategories ] = useState<Array<AsCategory>>([]);

    useEffect(() => {
      if (params.asBoardId) {
        GetASCategories(parseInt(params.asBoardId))
          .then(categories => {
            setASCategories(categories);
          });
      }
    }, []);

    const addASCategory = async (ascategory: AsCategory) => {
      if (params.asBoardId) {
        const newASCategory = await AddASCategory(ascategory, parseInt(params.asBoardId));
        setASCategories(ascategories.concat(newASCategory));
        return newASCategory;
      }
    }

    const updateASCategory = async (id: number, ascategory: AsCategory) => {
        await UpdateASCategory(id, ascategory);
        setASCategories(ascategories.map((ascat) => {
            if (ascat.id === id) {
                return {...ascat, ...ascategory};
            }
            return ascat;
        }));
        return ascategory;
    }

    const deleteASCategory = async (id: number) => {
        const res = await DeleteASCategory(id);
        if( res.message ) {
            setASCategories(ascategories.filter(ascategory => ascategory.id !== id));
        }
        return res;
    }

    return {
        ascategories,
        addASCategory,
        updateASCategory,
        deleteASCategory
    };
}