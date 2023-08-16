import MUIDataTable, {MUIDataTableOptions} from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import {customSort, dataTableColumns, renderExpandableRow, setRowProps} from "./dataTableOptions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { FicheInf } from "../../../models/ficheinf";
import TableContainer from "@material-ui/core/TableContainer";


export default function TableConsulation(props: { deleteFiche: Function, fiches: Array<FicheInf>, permissionTraitement: boolean }) {
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
  const fiches = props.fiches.map((el: FicheInf) => {
    let injuredCategory = ""
    if(el.injuredCategory?.name){
      if(el.injuredCategoryName && el.injuredCategoryName?.length > 0){
        injuredCategory = `${el.injuredCategory.name}: ${el.injuredCategoryName}`
      }else{
        injuredCategory = `${el.injuredCategory.name}`
      }
    }
    return {
      ...el,
      injuredCategory: injuredCategory,
      responsibleSecurite: `${el.responsibleSecurite?.firstname?.toUpperCase() || ""} ${el.responsibleSecurite?.lastname?.toUpperCase() || ""}`,
      emetteur: `${el.senderFirstname || ''} ${el.senderLastname || ''}`,
      service: el.service?.name || '',
      team: el.team?.name || '',
      zone: el.zone?.name || '',
      subzone: el.subzone?.name || '',
      materialElements: el.materialElements?.name || '',
      lesionDetails: el.lesionDetails?.name || '',
      careProvided: el.careProvided?.name || '',
      createdAt: moment(new Date(el.createdAt), "DD-MM-YYYY H:mm").format("DD-MM-YYYY HH:mm"),
    }
  })

  dataTableColumns.map(column => {
    if (column.label === "Editer" && !props.permissionTraitement){
      column.options.customBodyRender = () => {
        return (
          <p className="disabled">
            <FontAwesomeIcon
              icon={faPen}
              fixedWidth
              className="align-middle mr-3 btn-icon"
            />
          </p>
        )
      }
    }
    return column;
  })

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <TableContainer>
        <MUIDataTable data={fiches} columns={dataTableColumns} options={options} title={""} />
      </TableContainer>=
    </MuiThemeProvider>
  );
}
