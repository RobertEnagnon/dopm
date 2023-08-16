import React, { useState } from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import moment from "moment";
import ModalComponent from "../../../ficheSecurite/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Input, Row } from "reactstrap";
import { createTheme, MuiThemeProvider, } from "@material-ui/core/styles";
import Card from "react-bootstrap/Card";
import EditSubZone from "./editSubZone";
import { Zone } from "../../../../models/zone";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";
import { Subzone } from "../../../../models/subzone";

type ExpandableRowTableType = {
  zones: Array<Zone>
  addSubZone: Function,
  updateSubZone: Function,
  deleteSubZone: Function,
  openModalEdit: Function,
  openModalDelete: Function
}

const ExpandableRowTable = (props: ExpandableRowTableType) => {
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

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const [openEditSubZone, setOpenEditSubZone] = useState<boolean>(false);
  const [selectedSubZone, setSelectedSubZone] = useState<Subzone>();
  const [isActive, setActive] = useState<boolean>(false);
  const [subZoneName, setSubZoneName] = useState<string>("");

  const toggleClass = () => {
    setActive(!isActive);
  };

  const closeAddSubZone = () => {
    setIsAdded(!isAdded);
    setIsDeleted(!isDeleted);

    setActive(false);
  };

  // Suppression d'une zone
  const handleDeleteSubZone = async (id: number, zoneId: number) => {
    const response = await props.deleteSubZone(id, zoneId);
    if (response.message) {
      notify(response.message, NotifyActions.Successful);
      setIsDeleted(!isDeleted);
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  // close modal edit subzone
  const closeModalEdit = () => setOpenEditSubZone(false);

  // Modification d'une sub zone function
  const handleOpenEditSubZone = (subzone: Subzone) => {
    setOpenEditSubZone(true);
    setSelectedSubZone(subzone);
  };

  const handleAddSubZone = async (subzone: { name: string, zoneId: number }) => {
    if (subzone.name == "") {
      notify("Le nom est obligatoire !", NotifyActions.Error);
    } else {
      const response = await props.addSubZone(subzone);
      if (response.subZone) {
        notify("La sous zone a été ajoutée!", NotifyActions.Successful);
        setIsAdded(!isAdded);
        return response.subZone;
      } else {
        notify(response.error, NotifyActions.Successful);
        return null;
      }
    }
  };

  const openModalEdit = props.openModalEdit;

  const columns = [
    {
      label: "ID",
      name: "id",
    },
    {
      label: "Name",
      name: "name",
    },
    {
      label: "Description",
      name: "description",
    },
    {
      label: "subzones",
      name: "subzones",
      options: {
        viewColumns: false,
        display: false,
        print: false,
        download: false,
      },
    },
    {
      label: "Date de création",
      name: "createdAt",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) =>
          moment(new Date(value), "DD-MM-YYYY hh:mm").format(
            "DD-MM-YYYY hh:mm"
          ),
      },
    },
    {
      label: "Date de modification",
      name: "updatedAt",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) =>
          moment(new Date(value), "DD-MM-YYYY hh:mm").format(
            "DD-MM-YYYY hh:mm"
          ),
      },
    },
    {
      name: "Modifier",
      options: {
        filter: false,
        sort: false,
        empty: true,
        print: false,
        download: false,
        customBodyRenderLite: (dataIndex: number, rowIndex: number) => {
          return (
            <FontAwesomeIcon
              icon={faPen}
              fixedWidth
              style={{ cursor: "pointer" }}
              className="align-middle mr-3 btn-icon"
              onClick={() => openModalEdit(rowIndex)}
            />
          );
        },
      },
    },
  ];

  const openModalDelete = props.openModalDelete;

  const options: MUIDataTableOptions = {
    filter: true,
    onRowsDelete: (rowsDeleted: { lookup: { [dataIndex: number]: boolean }; data: Array<{ index: number; dataIndex: number }>; }) => {
      const data = props.zones;
      const zoneToDelete = rowsDeleted.data.map((d) => data[d.dataIndex]);
      const zoneIndex = rowsDeleted.data[0].dataIndex;
      openModalDelete(zoneToDelete[0].id, zoneIndex);
    },
    selectableRows: "single",
    rowsPerPage: 10,
    expandableRows: true,
    rowsExpanded: expandedRows,
    onRowExpansionChange: currentRowsExpanded => {
      if (expandedRows.includes(currentRowsExpanded[0].index)) {
        setExpandedRows([])
      } else {
        setExpandedRows(currentRowsExpanded.map(row => row.index))
      }
    },
    renderExpandableRow: (rowData: Array<any>) => {
      return (
        <>
          <tr>
            <td colSpan={6}>
              {!isActive && (
                <Button color="link" onClick={toggleClass}>
                  Add subZone
                </Button>
              )}
              {isActive && (
                <Card
                  border="primary"
                  style={{ width: "18rem", margin: "10px 10px 10px 20px" }}
                >
                  <Card.Header>Ajout de sous zone</Card.Header>

                  <Card.Body>
                    <label htmlFor="subZoneName" style={{ display: "block" }}>
                      Nom
                    </label>
                    <Input
                      required={true}
                      autoComplete="off"
                      type="text"
                      id="subZoneName"
                      name="subZoneName"
                      onChange={(e) => setSubZoneName(e.target.value)}
                    />

                    <div>
                      <Button
                        color="success"
                        onClick={async () => {
                          const subzone = await handleAddSubZone({
                            name: subZoneName,
                            zoneId: parseInt(rowData[0]),
                          });
                          rowData[3].push(subzone);
                          setActive(false);
                        }}
                      >
                        Enregistrer
                      </Button>
                      <Button color="secondary" onClick={closeAddSubZone}>
                        Fermer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </td>
          </tr>

          <>
            <tr>
              <td colSpan={6}>
                <Row xs={1} md={4} className="g-4">
                  {rowData[3].length > 0 ? (
                    rowData[3].map((subzone: Subzone) => (
                      <Col key={subzone.id}>
                        <Card
                          border="secondary"
                          style={{
                            width: "18rem",
                            margin: "10px 10px 10px 20px",
                          }}
                        >
                          <Card.Body>
                            <b>{subzone.name}</b>
                            <p style={{ float: "right" }}>
                              <FontAwesomeIcon
                                icon={faPen}
                                fixedWidth
                                className="align-middle mr-3 btn-icon"
                                onClick={() =>
                                  handleOpenEditSubZone(subzone)
                                }
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                                fixedWidth
                                className="align-middle mr-3 btn-icon"
                                onClick={function () {
                                  handleDeleteSubZone(subzone.id, subzone.zoneId);
                                  const index = rowData[3].indexOf(subzone);

                                  if (index > -1) {
                                    rowData[3] = rowData[3].filter(
                                      (item: Zone) => item !== subzone
                                    );
                                  }
                                }}
                              />
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p>No content</p>
                  )}
                </Row>
              </td>
            </tr>
          </>
        </>
      );
    },
    page: 0
  };

  return (
    <>
      <MuiThemeProvider theme={getMuiTheme()}>
        <ModalComponent
          children={
            <EditSubZone
              updateSubZone={props.updateSubZone}
              closeModalEdit={closeModalEdit}
              subzone={selectedSubZone}
            />
          }
          open={openEditSubZone}
          hide={() => setOpenEditSubZone(false)}
        />

        <MUIDataTable data={props.zones} columns={columns} options={options} title={"Zones"} />
      </MuiThemeProvider>
    </>
  );
};

export default ExpandableRowTable;
