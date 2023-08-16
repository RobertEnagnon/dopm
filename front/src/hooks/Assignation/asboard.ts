import {useEffect, useState} from "react";
import {AsBoard} from "../../models/Assignation/asBoard";
import {GetAsBoards, AddAsBoard, UpdateAsBoard, DeleteAsBoard} from "../../services/Assignation/asBoard";
import {notify, NotifyActions} from "../../utils/dopm.utils";

export const useAsBoard = () => {
  const [ asBoards, setAsBoards ] = useState<Array<AsBoard>>([]);

  useEffect(() => {
    FetchAsBoards()
  }, []);

  const FetchAsBoards = async () => {
    const asBoards = await GetAsBoards();
    setAsBoards(asBoards);
  }

  const addAsBoard = async (asBoard: AsBoard) => {
    const res = await AddAsBoard(asBoard)
    if (res.newAsBoard) {
      notify('AsBoard ajouté', NotifyActions.Successful)
      setAsBoards(asBoards.concat(res.newAsBoard))
    } else {
      notify('Problème ajout asBoard', NotifyActions.Error)
    }
  }

  const updateAsBoard = async (asBoard: AsBoard) => {
    await UpdateAsBoard(asBoard)

    setAsBoards(asBoards.map(b => {
      if (b.id === asBoard.id) {
        b = asBoard
      }
      return b
    }))
  }

  const deleteAsBoard = async (asBoardId: number) => {
    await DeleteAsBoard(asBoardId)

    setAsBoards(asBoards.filter(b => b.id !== asBoardId))
  }

  return { asBoards, addAsBoard, updateAsBoard, deleteAsBoard };
}