import GridLayout from "react-grid-layout";
import { Fiche } from "./fiche";
import type { Indicator } from "./Top5/indicator";

// Override GridLayout.Layout type because it doesn't contain an id attribute.
// The id attribute is necessary to identify the Layout in the database.
type BoardTuile = GridLayout.Layout & {
    id: number,
    tool: string,
    type: string,
    branche: number,
    format: string,
    indicator: Indicator,
    periode: string,
    fiches?: Array<Fiche>
}

export type {
    BoardTuile
}
