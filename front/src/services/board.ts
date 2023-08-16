import RequestService from "./request";
import { BoardTuile } from "../models/boardTuile";
import { GetFiches } from "./FicheSecurite/fiche";

const GetAllBoards = async (dashboardId: number) => {
  let boards: Array<BoardTuile> = [];

  let req = new RequestService()
  const res = await req.fetchEndpoint(`boards?dashboardId=${dashboardId}`);
  res?.data.forEach((board: BoardTuile) => {
    boards.push(board)
  })

  return boards;

}

const UpdateBoardsLayout = async (newLayout: Array<BoardTuile>, dashboardId: number) => {
  let boards: Array<BoardTuile> = [];
  let req = new RequestService()

  const res = await req.fetchEndpoint(`boards?dashboardId=${dashboardId}`, "PUT", newLayout);
  res?.data.forEach((board: BoardTuile) => {
    boards.push(board)
  })

  const fiches = await GetFiches();

  for (let i = 0; i < boards.length; i++) {
    if (boards[i].tool == "FicheSecurite") {
      boards[i].fiches = fiches;
    }
  }

  return boards;
}

const DeleteBoardById = async (id: number) => {
  let req = new RequestService()
  await req.fetchEndpoint(`board/${id}`, "DELETE");
}

export {
  GetAllBoards,
  UpdateBoardsLayout,
  DeleteBoardById
}
