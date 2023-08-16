import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "reactstrap";
import Card from "react-bootstrap/Card";
import { LightBox } from "../../../components/common";

const WIDTH_IMAGE = 230;
const HEIGHT_IMAGE = 200;
const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

const dataTableColumns = [

  {
    label: "ID",
    name: "id_fs",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        // console.log("tableMeta", tableMeta);
        // console.log("createdAt", tableMeta.tableData[tableMeta.rowIndex][18]);
        return (
          <Typography component={"span"} noWrap={true}>
            {value}
          </Typography>
        );
      },
    },
  },

  {
    label: "Firstname",
    name: "senderFirstname",
    options: {
      viewColumns: false,
      display: false,
      filter: true,
      sort: true,
      //filterType: 'textField'
    },
  },

  {
    label: "Lastname",
    name: "senderLastname",
    options: {
      viewColumns: false,
      display: false,
      filter: true,
      sort: true,
    },
  },

  {
    name: "emetteur",
    label: "Emetteur",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return (
          <Typography component={"span"} noWrap={true}>
            {value.toUpperCase()}
          </Typography>
        );
      },
    },
  },

  {
    label: "Categorie",
    name: "FSCategory",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    label: "Service",
    name: "service",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    label: "Equipe",
    name: "team",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    label: "Description",
    name: "description",
    options: {
      filter: true,
      sort: true,
      display: false,
      customBodyRender: (value: any) => {
        return <div>{value}</div>
      }
    }
  },

  {/////
    label: "Responsable Propos.",
    name: "responsibleConservatoire",
    options: {
      filter: true,
      sort: true,
      sortCompare: (order: any) => {
        /**
         * Les noms sont gardes dans obj.data
         * on comp obj1.data à obj2.data pour retourner -1 ou 1
         */
        return (obj1: any, obj2: any) => {
          let orderFactor = 1;
          if (order === "asc") orderFactor = 1
          else orderFactor = -1

          if (obj1.data == undefined) {
            return -1
          } else if (obj2.data == undefined) {
            return 1;
          }

          if (obj1.data?.toUpperCase() > obj2.data?.toUpperCase()) {
            return 1 * orderFactor;
          } else if (obj1.data?.toUpperCase() < obj2.data?.toUpperCase()) {
            return -1 * orderFactor;
          }
          return 0;
        }
      },
      customBodyRender: (value: any) => {
        return (
          <div>{value}</div>
        )
      },
    },
  },

  {/////
    label: "Lieu",
    name: "lieu",
    options: {
      filter: true,
      sort: true,
      sortCompare: (order: any) => {
        return (obj1: any, obj2: any) => {
          console.log(obj1.rowData)

          let orderFactor = 1;
          if (order === "asc") orderFactor = 1
          else orderFactor = -1

          if (obj1.rowData[12]?.toUpperCase() > obj2.rowData[12]?.toUpperCase()) {
            return 1 * orderFactor;
          } else if (obj1.rowData[12]?.toUpperCase() < obj2.rowData[12]?.toUpperCase()) {
            return -1 * orderFactor;
          } else if (obj1.rowData[13]?.toUpperCase() > obj2.rowData[13]?.toUpperCase()) {
            return 1 * orderFactor;
          } else if (obj1.rowData[13]?.toUpperCase() < obj2.rowData[13]?.toUpperCase()) {
            return -1 * orderFactor;
          }
          return 0
        }
      },
      customBodyRender: (value: any) => {

        return (
          <div style={{ width: "11rem", overflow: "hidden", textOverflow: "ellipsis" }}>
            <Typography component={"span"} noWrap={true}>
              {value}
            </Typography>
          </div>
        )
      },
    },
  },

  {/////status
    label: "Status",
    name: "status",
    options: {
      sort: true,
      filter: false,
      viewColumns: true,
      display: true,
    },
  },

  {
    label: "Date de création",
    name: "createdAt",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: any) => {
        return (
          <Typography component={"span"} noWrap={true}>
            {value}
          </Typography>
        );
      },
    },
  },

  {
    label: "zone",
    name: "zone",
    options: {
      viewColumns: false,
      display: false,
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return (
          <Typography component={"span"} noWrap={true}>
            {value}
          </Typography>
        )
      }
    },
  },

  {
    label: "subzone",
    name: "subzone",
    options: {
      viewColumns: false,
      display: false,
      filter: true,
      sort: true,
      print: false,
      download: false,
    },
  },


  {///////
    label: "Responsable Secu.",
    name: "responsibleSecurite",
    options: {
      filter: true,
      sort: true,
      sortCompare: (order: any) => {
        /**
         * Les noms sont gardes dans obj.data
         * on comp obj1.data à obj2.data pour retourner -1 ou 1
         */
        return (obj1: any, obj2: any) => {
          let orderFactor = 1;
          if (order === "asc") orderFactor = 1
          else orderFactor = -1

          if (obj1.data == undefined) {
            return -1
          } else if (obj2.data == undefined) {
            return 1;
          }

          if (obj1.data?.toUpperCase() > obj2.data?.toUpperCase()) {
            return 1 * orderFactor;
          } else if (obj1.data?.toUpperCase() < obj2.data?.toUpperCase()) {
            return -1 * orderFactor;
          }
          return 0;
        }
      },
      display: false,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    label: "Action securite",
    name: "mesureSecurisation",
    options: {
      sort: true,
      filter: false,
      viewColumns: false,
      display: false,
    },
  },

  {
    label: "Action conservatoire",
    name: "mesureConservatoire",
    options: {
      sort: true,
      filter: false,
      viewColumns: false,
      display: false,
    },
  },

  {
    label: "deadLineSecurisation",
    name: "deadLineSecurisation",
    options: {
      display: false,
      filter: false,
    },
  },

  {
    label: "deadLineConservatoire",
    name: "deadLineConservatoire",
    options: {
      display: false,
      filter: false,
    },
  },

  {
    label: "Classification",
    name: "classification",
    options: {
      display: false,
      filter: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      }
    }
  },

  {
    label: "Image 1",
    name: "image1",
    options: {
      display: false,
      filter: false
    },
  },

  {
    label: "Image 2",
    name: "image2",
    options: {
      display: false,
      filter: false
    },
  },

  {
    label: "Image 3",
    name: "image3",
    options: {
      display: false,
      filter: false
    },
  },

  {
    name: "id",
    label: "Editer",
    options: {
      filter: false,
      sort: false,
      empty: true,
      print: false,
      download: false,
      customBodyRender: (value: any) => {
        return (
          <Link to={`/FicheSecurite/traitement/${value}`}>
            <FontAwesomeIcon
              icon={faPen}
              fixedWidth
              className="align-middle mr-3 btn-icon"
            />
          </Link>
        );
      },
    },
  },
];

const customSort = (data: Array<any>, colIndex: number, order: string) => {
  console.log(colIndex);

  return data.sort((a, b) => {
    if (colIndex == 0) { // ID FS "YYYY-X"

      // Récupère l'ID (générée par MySQL)
      const idA = a.data[23];
      const idB = b.data[23];

      return (
          (idA - idB) * (order === "asc" ? 1 : -1)
      )
    } else if (colIndex == 3) { //emetteur
      return (
          (a.data[1].toLowerCase() < b.data[1].toLowerCase() ? -1 : 1) * (order === "asc" ? 1 : -1)
      )
    } else if (colIndex == 11) { // Date de création
      return (
          (moment(a.data[colIndex]).diff(b.data[colIndex]) < 0 ? -1 : 1) * (order === "asc" ? 1 : -1)
      )
    } else {
      return (
        (a.data[colIndex].toLowerCase() < b.data[colIndex].toLowerCase() ? -1 : 1) * (order === "asc" ? 1 : -1)
      )
    }
  })
}

const setRowProps = (row: any) => {
  let indexOfStatus = 9
  dataTableColumns.filter((el: any, k: number) => {
    if (el.name === 'status') {
      indexOfStatus = k
      return true
    }
  })
  if (row[indexOfStatus] === "Nouvelle") {
    return {
      style: {
        background: "rgb(255 255 255)",
        boxShadow: "5px 5px 5px rgb(68 68 68 / 60%)",
      },
    };
  } else if (row[indexOfStatus] === "En cours") {
    return {
      style: { background: "rgb(255 152 0 / 53%)" },
    };
  } else if (row[indexOfStatus] === "Cloturée") {
    return {
      style: { background: "rgb(139 195 74 / 53%)" },
    };
  } else if (row[indexOfStatus] === "Non FS") {
    return {
      style: { background: "rgb(158 158 158 / 72%)" },
    };
  } else {
    return {
      style: { background: "gold" },
    };
  }
}

const renderExpandableRow = (rowData: Array<string>) => {
  console.log(rowData)
  return (
    <>
      <tr>
        <td colSpan={4}>
          <Card
            border="primary"
            style={{
              border: "1px solid grey",
              width: "28rem",
              margin: "10px 10px 10px 20px",
            }}
          >
            <Card.Body>
              <div>
                <label className="label">Description</label>
                <p>{rowData[7]}</p>
              </div>

              <div>
                <label className="label">Sécurisation réalisée</label>
                <p>{rowData[15]}</p>
              </div>

              <div>
                <label className="label">Mesure proposée</label>
                <p>{rowData[16]}</p>
              </div>

              <div>
                <label className="label">Date de limite</label>
                <p>
                  {rowData[18]
                    ? moment(rowData[18], "YYYY/MM/DD").format("DD/MM/YYYY")
                    : ""}
                </p>
              </div>
            </Card.Body>
          </Card>
        </td>
        <td colSpan={9}>
          <Row>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {rowData[20] ? (
                <LightBox src={`${PUBLIC_API}${rowData[20]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[20]}`}
                    style={{ width: WIDTH_IMAGE, maxHeight: HEIGHT_IMAGE, justifyContent: 'center', boxShadow: '0px 8px 12px #afafaf', borderRadius: '4px' }}
                    alt={"photo"}
                  />
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 1</Typography>
              )}
            </Col>
            {console.log(PUBLIC_API)}
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {rowData[21] ? (
                <LightBox src={`${PUBLIC_API}${rowData[21]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[21]}`}
                    style={{ width: WIDTH_IMAGE, maxHeight: HEIGHT_IMAGE, boxShadow: '0px 8px 12px #afafaf', borderRadius: '4px' }}
                    alt={"photo"}
                  />
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 2</Typography>
              )}
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {console.log(PUBLIC_API)}
              {rowData[22] ? (
                <LightBox src={`${PUBLIC_API}${rowData[22]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[22]}`}
                    style={{ width: WIDTH_IMAGE, maxHeight: HEIGHT_IMAGE, boxShadow: '0px 8px 12px #afafaf', borderRadius: '4px' }}
                    alt={"photo"}
                  />
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 3</Typography>
              )}
            </Col>
          </Row>
        </td>
      </tr>
    </>
  );
}

export {
  dataTableColumns,
  customSort,
  setRowProps,
  renderExpandableRow
}
