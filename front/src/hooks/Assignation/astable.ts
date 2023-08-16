import {useEffect, useState} from "react";
import { AsTable } from "../../models/Assignation/asTable";
import {
    GetASTables,
    AddASTable,
    UpdateASTable,
    DeleteASTable,
    ReorderASTable
} from "../../services/Assignation/asTable";
import {AsTask} from "../../models/Assignation/asTask";
import {AddASTask, DeleteASTask, ReorderASTask, UpdateASTask} from "../../services/Assignation/asTask";
import { AddASChecklist, DeleteASChecklist, UpdateASChecklist } from "../../services/Assignation/asChecklist";
import { AddASFile, DeleteASFile } from "../../services/Assignation/asFile";
import {floatingMonths} from "../../pages/dashboard/GridComponents/services";
import { AddASComment } from "../../services/Assignation/asComment";
import { useParams } from "react-router-dom";

export const useASTable = () => {
    const params = useParams();
    const months = floatingMonths();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = months.filter(m => m.number.includes((today.getMonth() + 1).toString()))[0].number
    const [ tables, setTables ] = useState<Array<AsTable>>([]);
    const [ archivedView, setArchivedView ] = useState<boolean>(false);
    const [ selectedMonth, setSelectedMonth ] = useState<string>(currentMonth);
    const [ selectedYear, setSelectedYear ] = useState<string>(currentYear.toString());

    useEffect(() => {
        if (params.asBoardId) {
          GetASTables(archivedView, selectedMonth, selectedYear, parseInt(params.asBoardId))
            .then(tab => {
              setTables(tab);
            });
        }
    }, [archivedView, selectedMonth, selectedYear, params.asBoardId])

    const addTable = async (table: AsTable) => {
      if (params.asBoardId) {
        const newTable = await AddASTable({...table, orderTable: tables.length+1, asBoardId: parseInt(params.asBoardId)});
        setTables(tables.concat(newTable));
        return newTable;
      }
    }

    const updateTable = async (id: number, table: AsTable) => {
        await UpdateASTable(id, table);
        setTables(tables.map((tab) => {
            if(tab.id === id) {
                return {...tab, ...table };
            }
            return tab;
        }));
        return table;
    }

    const deleteTable = async (id: number) => {
        const res = await DeleteASTable(id);
        if( res.message ) {
            setTables(tables.filter(tab => tab.id !== id));
        }
        return res;
    }

    const reorderTable = async (start: number, end: number) => {
        const tablesReorder = Array.from(tables);
        const [removed] = tablesReorder.splice(start, 1);
        tablesReorder.splice(end, 0, removed);
        setTables(tablesReorder)
        await ReorderASTable(tablesReorder);
    }

    const addTask = async (task: AsTask) => {
        const currentTable = tables.find(table => table.id === task.tableId)
        const maxOrder = currentTable?.tasks.reduce((previousValue) => {
            previousValue += 1
            return previousValue
        }, 1)
        const newTask = await AddASTask({...task, orderTask: (maxOrder || 0) + 1});
        setTables(
            tables.map(table => {
                if (table.id === task.tableId) {
                    table.tasks = table.tasks.concat(newTask)
                }
                return table
            })
        );
        return newTask;
    }

    const updateTask = async (id: number, task: AsTask) => {
        const currentTable = tables.find(table => table.id === task.tableId);
        const currentTask = currentTable?.tasks.find(task => task.id === id)
        let taskNewValue = { ...currentTask, ...task }
        const res = await UpdateASTask(id, taskNewValue);
        taskNewValue = res?.data.newTask
        if (currentTask?.archived !== task.archived) {
            setTables(
                tables.map(table => {
                    if (table.id === task.tableId) {
                        table.tasks = table.tasks.filter(task => task.id !== id)
                    }
                    return table
                })
            )
        } else {
            setTables(
                tables.map(table => {
                    if (table.id === task.tableId) {
                        table.tasks = table.tasks.map(task => {
                            if (task.id === id) {
                                task = taskNewValue
                            }
                            return task
                        })
                    }
                    return table
                })
            )
        }
        return task;
    }

    const moveTask = async (id: number, task: AsTask, newTableId: number) => {
        const currentTable = tables.find(table => table.id === task.tableId);
        const currentTask = currentTable?.tasks.find(task => task.id === id)
        let taskNewValue = { ...currentTask, ...task, tableId: newTableId }
        await UpdateASTask(id, taskNewValue);
        setTables(
            tables.map(table => {
                if (table.id === task.tableId) {
                    table.tasks = table.tasks.filter(t => t.id !== taskNewValue.id)
                }
                if (table.id === newTableId) {
                    table.tasks = table.tasks.concat(taskNewValue)
                }
                return table
            })
        )
        return task;
    }

    const deleteTask = async (task: AsTask) => {
        const res = await DeleteASTask(task.id);
        if( res.message ) {
            setTables(
                tables.map(table => {
                    if (table.id === task.tableId) {
                        table.tasks = table.tasks.filter(t => t.id !== task.id)
                    }
                    return table
                })
            );
        }
        return res;
    }

    const reorderTask = async (sourceTableId: number, destinationTableId: number, taskId: number, start: number, end: number) => {
        const sourceTasksReorder = tables.find(table => table.id === sourceTableId)!.tasks;
        const destinationTasksReorder = tables.find(table => table.id === destinationTableId)!.tasks;
        if (sourceTableId !== destinationTableId) {
            const [removed] = sourceTasksReorder.splice(start, 1);
            removed.tableId = destinationTableId
            destinationTasksReorder.splice(end, 0, removed);
            setTables(tables.map(table => {
                if (table.id === sourceTableId) {
                    table.tasks = sourceTasksReorder
                }
                if (table.id === destinationTableId) {
                    table.tasks = destinationTasksReorder
                }
                return table
            }))
            await ReorderASTask(sourceTasksReorder);
            await ReorderASTask(destinationTasksReorder);
        } else {
            const [removed] = destinationTasksReorder.splice(start, 1);
            destinationTasksReorder.splice(end, 0, removed);
            setTables(tables.map(table => {
                if (table.id === destinationTableId) {
                    table.tasks = destinationTasksReorder
                }
                return table
            }))
            await ReorderASTask(destinationTasksReorder);
        }
    }

    const addComment = async (tableId: number, taskId: number, text: string) => {
        const newComment = await AddASComment(taskId, text);
        setTables(tables.map(table => {
            if (table.id === tableId) {
                table.tasks = table.tasks.map(t => {
                    if (t.id === taskId) {
                        t.conversation = [newComment].concat(t.conversation)
                    }
                    return t
                })
            }
            return table
        }))
    }

    const addChecklist = async (tableId: number, taskId: number, checkElement: { id: number, label: string, done: 0 | 1 } | null = null) => {
        const newChecklist = await AddASChecklist(taskId, checkElement);
        setTables(tables.map(table => {
            if (table.id === tableId) {
                table.tasks = table.tasks.map(t => {
                    if (t.id === taskId) {
                        t.checklist = t.checklist.concat(newChecklist)
                    }
                    return t
                })
            }
            return table
        }))
    }

    const updateChecklist = async (tableId: number, taskId: number, checklistId: number, label: string, done: 0 | 1) => {
        await UpdateASChecklist(checklistId, taskId, label, done);
        setTables(tables.map(table => {
            if (table.id === tableId) {
                table.tasks = table.tasks.map(t => {
                    if (t.id === taskId) {
                        t.checklist = t.checklist.map(c => {
                            if (c.id === checklistId) {
                                c.label = label
                                c.done = done
                            }
                            return c
                        })
                    }
                    return t
                })
            }
            return table
        }))
    }

    const deleteChecklist = async (tableId: number, taskId: number, checklistId: number) => {
        await DeleteASChecklist(checklistId, taskId);
        setTables(tables.map(table => {
            if (table.id === tableId) {
                table.tasks = table.tasks.map(t => {
                    if (t.id === taskId) {
                        t.checklist = t.checklist.filter(c => c.id !== checklistId)
                    }
                    return t
                })
            }
            return table
        }))
    }

    const addFile = async (tableId: number, taskId: number, file: File) => {
        const newFile = await AddASFile(taskId, file);
        setTables(tables.map(table => {
            if (table.id === tableId) {
                table.tasks = table.tasks.map(t => {
                    if (t.id === taskId) {
                        t.files = t.files.concat(newFile)
                    }
                    return t
                })
            }
            return table
        }))
    }

    const deleteFile = async (tableId: number, taskId: number, fileId: number) => {
        await DeleteASFile(fileId, taskId);
        setTables(tables.map(table => {
            if (table.id === tableId) {
                table.tasks = table.tasks.map(t => {
                    if (t.id === taskId) {
                        t.files = t.files.filter(f => f.id !== fileId)
                    }
                    return t
                })
            }
            return table
        }))
    }

    return {
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
    }
}