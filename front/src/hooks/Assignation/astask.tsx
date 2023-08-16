import {useEffect, useState} from "react";
import {AsTask} from "../../models/Assignation/asTask";
import {AddASTask, DeleteASTask, GetASTasks, ReorderASTask, UpdateASTask} from "../../services/Assignation/asTask";
import {AsTable} from "../../models/Assignation/asTable";

export const useASTask = () => {
    const [ tasks, setTasks ] = useState<Array<AsTask>>([]);
    const [ table, setTable ] = useState<AsTable>();

    useEffect(()=>{
        if(table?.id) {
            GetASTasks(table.id)
                .then(task => {
                    setTasks(task)
                });
        }
    }, [ table ])

    return {
        tasks,
        table,
        setTable,
    }
}