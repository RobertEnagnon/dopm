import {useEffect, useState} from "react";
import {Responsible} from "../models/responsible";
import {AddResponsible, DeleteResponsible, GetResponsibles, UpdateResponsible} from "../services/responsible";

export const useResponsible = () => {
  const [ responsibles, setResponsibles ] = useState<Array<Responsible>>([]);

  useEffect(() => {
    let isMounted = true;
    GetResponsibles()
      .then((responsibles) => {
        if (isMounted) {
          setResponsibles( sortResponsible( responsibles ));
        }
      });
    return () => {
      isMounted = false
    }
  }, []);

  const sortResponsible = ( array: Array<Responsible> ) => {
    return array.sort((a, b) => {
      if( a.lastname?.toLowerCase() < b.lastname?.toLowerCase() ) {
        return -1;
      } else if( a.lastname?.toLowerCase() > b.lastname?.toLowerCase() ) {
        return 1;
      } else if( a.firstname?.toLowerCase() < b.firstname?.toLowerCase() ) {
        return -1;
      } else if( a.firstname?.toLowerCase() > b.firstname?.toLowerCase() ) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  const addResponsible = async (responsible: Responsible) => {
    const newResponsible = await AddResponsible(responsible);
    setResponsibles(sortResponsible( responsibles.concat(newResponsible ) ));
  }

  const updateResponsible = async (id: number, responsible: Responsible) => {
    const message = await UpdateResponsible(id, responsible);
    if (message) {
      setResponsibles(sortResponsible( responsibles.map((resp) => {
        if (resp.id === id) {
          return { ...resp, ...responsible }
        }
        return resp;
      })));
    }
    return message;
  }

  const deleteResponsible = async (id: number) => {
    const res = await DeleteResponsible(id);
    if (res?.data.message) {
      setResponsibles(sortResponsible(responsibles).filter(resp => resp.id !== id));
    }
    return res;
  }

  return { responsibles, addResponsible, updateResponsible, deleteResponsible };
}
