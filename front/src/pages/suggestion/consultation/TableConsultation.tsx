import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import {
  customSort,
  dataTableColumns,
  renderExpandableRow,
  setRowProps,
} from "./dataTableOptions";
import { Suggestion } from "../../../models/suggestion";
import {useEffect, useState} from "react";
import TableContainer from "@material-ui/core/TableContainer";

interface TableConsulationProps {
  deleteSuggestion: Function;
  suggestions: Suggestion[];
}

export default function TableConsulation({
  deleteSuggestion,
  suggestions,
}: TableConsulationProps) {
  const [ dataToDisplay, setDataToDisplay ] = useState<Array<any>>([]);

  useEffect(() => {
    let data: any[] = [];
    suggestions.forEach((suggestion) => {
      let status;

      if (!suggestion.statusWorkflow) {
        status = "Nouvelle";
      } else {
        status = "En cours";
      }

      if (suggestion.statusWorkflow?.secondValidated) {
        status = "Validée";
      }

      if (
          suggestion.statusWorkflow?.firstValidated === false ||
          suggestion.statusWorkflow?.secondValidated === false
      ) {
        status = "Refusée";
      }

      data.push({
        ...suggestion,
        sugCategory: suggestion.sugCategory?.name?.toUpperCase(),
        service: suggestion.service?.name?.toUpperCase(),
        team: suggestion.team?.name?.toUpperCase(),
        statusWorkflow: status
      })
    })

    setDataToDisplay(data);
  }, [suggestions])

  const getMuiTheme = () =>
    createTheme({
      overrides: {
        MUIDataTable: {
          root: {},
          paper: {
            boxShadow: "none",
          },
        },
        MUIDataTableBodyRow: {
          root: {
            "&:nth-child(odd)": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
        MUIDataTableBodyCell: {},
      },
    });

  const options: MUIDataTableOptions = {
    filter: true,
    selectableRows: "none",
    rowsPerPageOptions: [10, 30, 50, 100],
    rowsPerPage: 100,
    expandableRows: true,
    customSort: customSort,
    setRowProps: setRowProps,
    renderExpandableRow: renderExpandableRow,
    onRowsDelete: (rowsDeleted: {
      data: Array<{ index: number; dataIndex: number }>;
      lookup: { [dataIndex: number]: boolean };
    }) => {
      const zoneIndex = rowsDeleted.data[0].dataIndex;
      deleteSuggestion(zoneIndex);
    },
  };

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <TableContainer>
        <MUIDataTable
            data={dataToDisplay}
            columns={dataTableColumns}
            options={options}
            title={""}
        />
      </TableContainer>
    </MuiThemeProvider>
  );
}
