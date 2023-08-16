import RequestService from "../request";
import { AsBoard } from "../../models/Assignation/asBoard";

const GetAsBoards = async () => {
    let asBoards: Array<AsBoard> = []

    let req = new RequestService();
    const res = await req.fetchEndpoint( 'as_boards' )
    if(res?.data && res.data.length > 0) {
        res.data.forEach((asBoard: AsBoard) => {
            asBoards.push({
                id: asBoard.id,
                name: asBoard.name,
                order: asBoard.order,
                createdAt: new Date(asBoard.createdAt)
            })
        })
    }

    return asBoards
}

const AddAsBoard = async (asBoard: AsBoard) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('as_boards', 'POST', asBoard);
    return res?.data;
}

const UpdateAsBoard = async (asBoard: AsBoard) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_boards/${asBoard.id}`, 'PUT', asBoard);
    return res?.data;
}

const DeleteAsBoard = async (asBoardId: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_boards/${asBoardId}`, 'DELETE');
    return res?.data;
}

export {
    GetAsBoards,
    AddAsBoard,
    UpdateAsBoard,
    DeleteAsBoard
}