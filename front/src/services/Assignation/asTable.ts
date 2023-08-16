import RequestService from "../request";
import {AsTable} from "../../models/Assignation/asTable";

const GetASTables = async (archivedView: boolean, month: string, year: string, asBoardId: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_tables?archived=${archivedView ? 1 : 0}&month=${month}&year=${year}&asBoardId=${asBoardId}`);
    return res?.data.map((table: AsTable) => ({
        ...table,
        createdAt: new Date(table.createdAt),
        updatedAt: new Date(table.updatedAt)
    }));
}

const AddASTable = async (table: AsTable) => {
    let req = new RequestService();
    let user = JSON.parse( localStorage.getItem('user')! );

    const res = await req.fetchEndpoint('as_tables', 'POST', {...table, user});
    const newTable = res?.data.newASTable;

    return {
        ...newTable,
        updatedAt: new Date(newTable.updatedAt),
        createdAt: new Date(newTable.createdAt)
    };
}

const UpdateASTable = async (id: number, table: AsTable) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`as_tables/${id}`, 'PUT', table);
}

const DeleteASTable = async (id: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_tables/${id}`, 'DELETE');
    return res?.data;
}

const ReorderASTable = async (tables: Array<AsTable>) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('as_tables_reorder', 'PUT', {tables});
    return res?.data
}

export {
    GetASTables,
    AddASTable,
    UpdateASTable,
    DeleteASTable,
    ReorderASTable
}