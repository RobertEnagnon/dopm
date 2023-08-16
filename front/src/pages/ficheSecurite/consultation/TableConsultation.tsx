import MUIDataTable, {MUIDataTableOptions} from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import { Fiche } from "../../../models/fiche";
import {customSort, dataTableColumns, renderExpandableRow, setRowProps} from "./dataTableOptions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import TableContainer from "@material-ui/core/TableContainer";


export default function TableConsulation(props: { deleteFiche: Function, fiches: Array<Fiche>, permissionTraitement: boolean }) {
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
    rowsPerPage: 30,
    expandableRows: true,
    customSort: customSort,
    setRowProps: setRowProps,
    renderExpandableRow: renderExpandableRow,
    onRowsDelete: (rowsDeleted: { data: Array<{ index: number; dataIndex: number }>, lookup: { [dataIndex: number]: boolean } }) => {
      const zoneIndex = rowsDeleted.data[0].dataIndex;
      props.deleteFiche(zoneIndex);
    },
    /**
     * On parse le séparateur pour que les tableurs (Excel, OpenOffice, LibreOffice, etc...) face la séparation en colonne de nos différentes données.
     */
    downloadOptions: {
      separator: ';',
      filterOptions: { useDisplayedColumnsOnly: true }
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
  };
  /**
   * on parse le tableau de fiches en amont pour pouvoir utiliser les filtres sur le contenu des objets
   * Sans oublier d'inclure les champs 'emetteur' et 'zone' qui n'existent pas dans l'objet de base
   * ceci permet de faire fonctionner les filtres correctement
   */
  const fiches = props.fiches.map((el: any) => {
    return {
      ...el,
      FSCategory: el.FSCategory?.name || '',
      assignation: `${el.assignation?.firstname?.toUpperCase() || ""} ${el.assignation?.lastname?.toUpperCase() || ""}`,
      emetteur: `${el.senderFirstname || ''} ${el.senderLastname || ''}`,
      responsibleConservatoire: `${el.responsibleConservatoire?.first_name?.toUpperCase() || ""} ${el.responsibleConservatoire?.last_name?.toUpperCase() || ""}`,
      responsibleSecurite: `${el.responsibleSecurite?.first_name?.toUpperCase() || ""} ${el.responsibleSecurite?.last_name?.toUpperCase() || ""}`,
      service: el.service?.name || '',
      subzone: el.subzone?.name || '',
      team: el.team?.name || '',
      zone: el.zone?.name || '',
      lieu: `${el.zone?.name || ''} ${ el.subzone?.name ? `- ${el.subzone?.name}` : ''}`,
      createdAt: moment(new Date(el.createdAt), "DD-MM-YYYY H:mm").format("DD-MM-YYYY HH:mm"),
      classification: el.classification?.name || ''
    }
  })

  dataTableColumns.map(column => {
    if (column.label === "Editer" && !props.permissionTraitement)
    {
      column.options.customBodyRender = () => {
        return (
          <p className="disabled">
            <FontAwesomeIcon
              icon={faPen}
              fixedWidth
              className="align-middle mr-3 btn-icon"
            />
          </p>
        );
      }
    }
    return column;
  })

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <TableContainer>
        <MUIDataTable data={fiches} columns={dataTableColumns} options={options} title={""} />
      </TableContainer>
    </MuiThemeProvider>
  );
}
