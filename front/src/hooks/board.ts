import { useEffect, useRef, useState } from "react";
import { BoardTuile } from "../models/boardTuile";
import { GetAllBoards } from "../services/board";
import { GetFiches } from "../services/FicheSecurite/fiche";

const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  return isMounted;
}

export const useBoard = () => {
  const [boards, setBoards] = useState<Array<BoardTuile>>();
  const isMountedRef = useIsMounted();

  const FetchAllBoards = async (isSidebarOpen: boolean, dashboardId: number) => {

    const fetchedBoards = await GetAllBoards(dashboardId);
    const fiches = await GetFiches();

    const maximum = fetchedBoards?.reduce((max: number, current: BoardTuile) => {
      return max > parseInt(current.i) ? max : parseInt(current.i);
    }, 0);

    for (let i = 0; i < fetchedBoards.length; i++) {
      if (fetchedBoards[i].tool == "FicheSecurite") {
        fetchedBoards[i].fiches = fiches;
      }
    }

    const resizableBoards = fetchedBoards?.map((item: BoardTuile) => {

      // if there is no maximum value, the maximum value is equal to the height value + 5.
      item.maxH = !item.maxH ? item.h + 5 : item.maxH;

      return { ...item, indicator: { ...item.indicator }, isResizable: isSidebarOpen };
    });

    if (isMountedRef.current) {
      setBoards(resizableBoards);
    }

    return { boards: resizableBoards, maximum };

  }

  return { boards, FetchAllBoards };
}