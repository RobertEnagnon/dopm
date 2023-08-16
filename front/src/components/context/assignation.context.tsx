import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {useASTable} from "../../hooks/Assignation/astable";
import {AsTable} from "../../models/Assignation/asTable";
import {UserData} from "../../models/user";
import {AsTask} from "../../models/Assignation/asTask";

const displayModes = {
    day: 1,
    week: 2,
    doubleWeeks: 3,
    month: 4
}

type Props = {
    children: ReactNode;
}

type AssignationContextType = {
    tables: AsTable[];
    addTable: any;
    updateTable: any;
    deleteTable: any;
    reorderTable: any;

    addTask: any;
    updateTask: any;
    moveTask: any;
    deleteTask: any;
    reorderTask: any;

    addComment: Function;

    addChecklist: any;
    updateChecklist: any;
    deleteChecklist: any;

    addFile: any;
    deleteFile: any;

    archivedView: boolean;
    setArchivedView: any;

    selectedMonth: string;
    setSelectedMonth: any;

    selectedYear: string;
    setSelectedYear: any;

    getTasksByResponsibles: () => Array<UserData & { tasks: Array<AsTask> }>;
    displayModes: { day: number, week: number, doubleWeeks: number, month: number },
    displayMode: number,
    updateDisplayMode: Function
}

const AssignationContextDefaultValues: AssignationContextType = {
    tables: [],
    addTable: () => { return null },
    updateTable: () => { return null },
    deleteTable: () => { return null },
    reorderTable: () => { return null },

    addTask: () => { return null },
    updateTask: () => { return null },
    moveTask: () => { return null },
    deleteTask: () => { return null },
    reorderTask: () => { return null },

    addComment: () => { return null },

    addChecklist: () => { return null },
    updateChecklist: () => { return null },
    deleteChecklist: () => { return null },

    addFile: () => { return null },
    deleteFile: () => { return null },

    archivedView: false,
    setArchivedView: () => { return null },

    selectedMonth: '',
    setSelectedMonth: () => { return null },

    selectedYear: '',
    setSelectedYear: () => { return null },

    getTasksByResponsibles: () => { return [] },

    displayModes: displayModes,
    displayMode: 0,
    updateDisplayMode: () => {}
}

export const AssignationContext = createContext<AssignationContextType>(AssignationContextDefaultValues);

export function useAssignation() {
    return useContext(AssignationContext)
}

export function AssignationProvider( { children } : Props ) {
    const [displayMode, setDisplayMode] = useState<number>(displayModes.week);

    const {
        tables,
        addTable,
        updateTable,
        deleteTable,
        reorderTable,

        addTask,
        updateTask,
        moveTask,
        deleteTask,
        reorderTask,

        addComment,

        addChecklist,
        updateChecklist,
        deleteChecklist,

        addFile,
        deleteFile,

        archivedView,
        setArchivedView,

        selectedMonth,
        setSelectedMonth,

        selectedYear,
        setSelectedYear
    } = useASTable();

    const updateDisplayMode = (zoom: boolean) => {
        switch (displayMode) {
            case displayModes.day:
                !zoom && setDisplayMode(displayModes.week)
                break
            case displayModes.week:
                setDisplayMode(zoom ? displayModes.day : displayModes.doubleWeeks)
                break
            case displayModes.doubleWeeks:
                setDisplayMode(zoom ? displayModes.week : displayModes.month)
                break
            case displayModes.month:
                zoom && setDisplayMode(displayModes.doubleWeeks)
                break
        }
    }

    const getTasksByResponsibles = () => {
        let responsibles: Array<UserData & { tasks: Array<AsTask> }> = [];

        tables.forEach(table => {
            table.tasks.forEach(task => {
                task.responsibles.forEach(responsible => {
                    let responsibleToPush
                    let foundedResponsible = responsibles.filter(resp => resp.id === responsible.id)
                    responsibleToPush = foundedResponsible
                    if (foundedResponsible.length === 0) {
                        responsibleToPush = { ...responsible, tasks : [task] }
                        responsibles.push(responsibleToPush)
                    } else {
                        responsibles = responsibles.map(resp => {
                            if (resp.id === responsible.id) {
                                resp.tasks.push(task)
                            }
                            return resp
                        })
                    }
                })
            })
        })

        return responsibles
    }

    const value = useMemo(() => ({
        tables: tables,
        addTable,
        updateTable,
        deleteTable,
        reorderTable,

        addTask,
        updateTask,
        moveTask,
        deleteTask,
        reorderTask,

        addComment,

        addChecklist,
        updateChecklist,
        deleteChecklist,

        addFile,
        deleteFile,

        archivedView,
        setArchivedView,

        selectedMonth,
        setSelectedMonth,

        selectedYear,
        setSelectedYear,

        getTasksByResponsibles,

        displayModes,
    }), [tables]);

    return (
        <>
            <AssignationContext.Provider value={{ ...value, displayMode, updateDisplayMode}}>
                {children}
            </AssignationContext.Provider>
        </>
    )
}
