import {useEffect, useState} from "react"
import { CareProvided } from "../../models/careProvided";

export const useCare = () => {
  const [ care, setCare ] = useState<Array<CareProvided>>([]);

  useEffect(() => {
    /**INF ceci est une generation fake */
    setCare([
        {
            id: 1,
            name: "SST",
        },
        {
            id: 2,
            name: "Infirmiere",
        },
        {
            id: 3,
            name: "Pompier",
        }
    ])
  }, [])

  return { care };
}