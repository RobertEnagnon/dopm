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
    //0 - ID
    label: "ID",
    name: "id_fi",
    options: {
      filter: true,
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
    //1 - Firstname
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
    //2 - Lastname
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
    //3 - Emetteur
    label: "Emetteur",
    name: "emetteur",
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
    //4 - Identification du blessé
    label: "Identification du blessé",
    name: "injuredCategory",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    //5 - Eléments Matériels
    label: "Eléments Matériels",
    name: "materialElements",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    //6 - Détails des Lésions
    label: "Détails des Lésions",
    name: "lesionDetails",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    //7 - Soins réalisés
    label: "Soins réalisés",
    name: "careProvided",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    //8 - Service
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
    //9 - Equipe
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
    //10 - Circonstances
    label: "Circonstances",
    name: "circumstances",
    options: {
      filter: true,
      sort: true,
      display: false,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    //11 - status
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
    //12 - Date de création
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
    //13 - zone
    label: "zone",
    name: "zone",
    options: {
      viewColumns: false,
      display: true,
      filter: true,
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
    //14 - subzone
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

  {
    //15 - Responsable Secu.
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
          if (order === "asc") orderFactor = 1;
          else orderFactor = -1;

          if (obj1.data == undefined) {
            return -1;
          } else if (obj2.data == undefined) {
            return 1;
          }

          if (obj1.data?.toUpperCase() > obj2.data?.toUpperCase()) {
            return 1 * orderFactor;
          } else if (obj1.data?.toUpperCase() < obj2.data?.toUpperCase()) {
            return -1 * orderFactor;
          }
          return 0;
        };
      },
      display: false,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
    },
  },

  {
    //16 - Date
    label: "Date",
    name: "dateAccident",
    options: {
      display: false,
      filter: false,
    },
  },

  {
    //17 - Image 1
    label: "Image 1",
    name: "image1",
    options: {
      display: false,
      filter: false,
    },
  },

  {
    //18 - lesionImage
    label: "Image détails des lésions",
    name: "lesionImage",
    options: {
      display: false,
      filter: false,
    },
  },

  {
    //19 - Editer
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
          <Link to={`/FicheInfirmerie/traitement/${value}`}>
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
  return data.sort((a, b) => {
    if (colIndex == 4 || colIndex == 8 || colIndex == 9) {
      //InjuredCategorie Service Equipe
      return (
        (a.data[colIndex].toLowerCase() < b.data[colIndex].toLowerCase()
          ? -1
          : 1) * (order === "asc" ? 1 : -1)
      );
    } else if (colIndex == 3) {
      //emetteur
      return (
        (a.data[1].toLowerCase() < b.data[1].toLowerCase() ? -1 : 1) *
        (order === "asc" ? 1 : -1)
      );
    } else if (colIndex == 15) {
      //Responsable Secu
      return (
        (a.data[colIndex].toLowerCase() < b.data[colIndex].toLowerCase()
          ? -1
          : 1) * (order === "asc" ? 1 : -1)
      );
    } else {
      return (
        (a.data[colIndex].toLowerCase() < b.data[colIndex].toLowerCase()
          ? -1
          : 1) * (order === "desc" ? 1 : -1)
      );
    }
  });
};

const setRowProps = (row: any) => {
  let indexOfStatus = dataTableColumns.findIndex((el) => el.name === "status");

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
};

const renderExpandableRow = (rowData: Array<string>) => {
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
                <label className="label">Circonstances</label>
                <p>{rowData[10]}</p>
              </div>

              <div>
                <label className="label">Date</label>
                <p>
                  {rowData[16]
                    ? moment(rowData[16], "YYYY/MM/DD").format("DD/MM/YYYY")
                    : ""}
                </p>
              </div>
            </Card.Body>
          </Card>
        </td>
        <td colSpan={4}>
          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBlock: "10px"
              }}
            >
              {rowData[17] ? (
                <LightBox src={`${PUBLIC_API}${rowData[17]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[17]}`}
                    style={{
                      width: WIDTH_IMAGE,
                      maxHeight: HEIGHT_IMAGE,
                      justifyContent: "center",
                      boxShadow: "0px 8px 12px #afafaf",
                      borderRadius: "4px",
                    }}
                    alt={"photo"}
                  />
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 1</Typography>
              )}
            </Col>
          </Row>
        </td>
        <td colSpan={4}>
          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBlock: "10px"
              }}
            >
              {rowData[18] ? (
                <LightBox src={require('../../../assets/img/dopm/human.png')} srcDraw={`${PUBLIC_API}${rowData[18]}`} alt={"lightBox"}>
                  <div style={{position: "relative"}}>
                    <img
                      src={require('../../../assets/img/dopm/human.png')}
                      style={{
                        width: WIDTH_IMAGE,
                        maxHeight: HEIGHT_IMAGE,
                        justifyContent: "center",
                        boxShadow: "0px 8px 12px #afafaf",
                        borderRadius: "4px",
                        position: "absolute",
                        zIndex: "10",
                        inset: "0"
                      }}
                      alt={"photo"}
                    />
                    <img
                      src={`${PUBLIC_API}${rowData[18]}`}
                      style={{
                        width: WIDTH_IMAGE,
                        maxHeight: HEIGHT_IMAGE,
                        justifyContent: "center",
                        position: "relative",
                        zIndex: "15",
                      }}
                      alt={"photo"}
                    />
                  </div>
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 1</Typography>
              )}
            </Col>
          </Row>
        </td>
      </tr>
    </>
  );
};

export { dataTableColumns, customSort, setRowProps, renderExpandableRow };
