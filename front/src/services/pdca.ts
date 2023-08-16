import moment from "moment";
import RequestService from "./request";
import type { Task } from '../models/pdca'
import type { Table } from '../models/pdca'
import type { Category } from '../models/pdca'

const GetTasks = async () => {
    let tasks: Array<Task> = [];
    // let users: Array<Task> = [];

    let req = new RequestService();
    await req.fetchEndpoint(`tasks`)
    .then( res => {
        if( res?.data && res.data.length > 0 ) {
            res.data.forEach((task: Task ) => {
                tasks.push({
                    id : task.id,
                    title: task.title,
                    what: task.what,
                    when: task.when,
                    hours: task.hours,
                    why: task.why,
                    picture: task.picture,
                    flashing: task.flashing,
                    currentEvent: task.currentEvent,
                    commitmentDate: task.commitmentDate,
                    status: task.status,
                    userTask: task.userTask,
                    table: task.table,
                    createdAt: moment( task.createdAt ).toDate(),
                    updatedAt: moment( task.createdAt ).toDate(),
                })
            })
            
        }
    })

    return tasks;

}
const GetTables = async () => {
    let tables: Array<Table> = [];
    let req = new RequestService();
    await req.fetchEndpoint(`tables`)
    .then( res => {
        if( res?.data && res.data.length > 0 ) {
            res.data.forEach((table: Table ) => {
                tables.push({
                    id : table.id,
                    name : table.name,
                    description : table.description,
                    userTable : table.userTable,
                    taskTable : table.taskTable,
                    createdAt: moment( table.createdAt ).toDate(),
                    updatedAt: moment( table.createdAt ).toDate(),
                })
            })
            
        }
    })
    console.log(tables)
    return tables;

}
const GetAsCategories = async () => {
    let categories: Array<Category> = [];
    let req = new RequestService();
    await req.fetchEndpoint(`ascategories`)
    .then( res => {
        if( res?.data && res.data.length > 0 ) {
            res.data.forEach((category: Category ) => {
                categories.push({
                    id : category.id,
                    name : category.name,
                    description : category.description,
                    taskCategory : category.taskCategory,
                    createdAt: moment( category.createdAt ).toDate(),
                    updatedAt: moment( category.createdAt ).toDate(),
                })
            })
            
        }
    })
    console.log(categories)
    return categories;

}
export {
    GetTasks,
    GetTables,
    GetAsCategories
}