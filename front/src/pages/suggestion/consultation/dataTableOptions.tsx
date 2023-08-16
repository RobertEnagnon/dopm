import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import { LightBox } from "../../../components/common";

const WIDTH_IMAGE: number = 230;
const HEIGHT_IMAGE: number = 200;
const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

const dataTableColumns = [
  {
    label: "ID",
    name: "id_sug",
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
    label: "Categorie",
    name: "sugCategory",
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
      sort: false,
      filter: false,
      viewColumns: false,
      display: false,
    },
  },
  {
    label: "Status",
    name: "statusWorkflow",
    options: {
      sort: true,
      viewColumns: true,
      customBodyRender: (value: any) => {
        return <div>{value}</div>;
      },
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
            {moment(new Date(value), "DD-MM-YYYY H:mm").format(
              "DD-MM-YYYY HH:mm"
            )}
          </Typography>
        );
      },
    },
  },
  {
    label: "Image 1",
    name: "imageNameOne",
    options: {
      display: false,
      filter: false
    },
  },
  {
    label: "Image 2",
    name: "imageNameTwo",
    options: {
      display: false,
      filter: false
    },
  },
  {
    label: "Image 3",
    name: "imageNameThree",
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
          <Link to={`/Suggestion/traitement/${value}`}>
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
  console.log(data)
  return data.sort((a, b) => {
    /*
    * 👉 0 = Id Suggestion
    * */
    if (colIndex == 0) {
      return (a.data[10] - b.data[10]) * (order === "asc" ? 1 : -1)
    }
    /*
    * 👉 1 = Catégorie
    * 👉 2 = Service
    * 👉 3 = Équipe
    * 👉 7 = ??
    * 👉 8 =??
    * */
    else if (colIndex == 1 || colIndex == 2 || colIndex == 3 || colIndex == 7 || colIndex == 8) {
      return (
          (a.data[colIndex] < b.data[colIndex] ? -1 : 1) *
          (order === "asc" ? 1 : -1)
      );
    }
    /*
    * 👉 5 = Status
    * */
    else if(colIndex == 5) {
      const valuesDictionary = {
        "Nouvelle": 0,
        "En cours": 1,
        "Validee": 3,
        "Refusee": 2
      }

      let aValue;
      let bValue;

      switch (a.data[colIndex]) {
        case "Validée":
          aValue = valuesDictionary["Validee"];
          break;
        case "Refusée":
          aValue = valuesDictionary["Refusee"];
          break;
        default:
          // @ts-ignore
          aValue = valuesDictionary[a.data[colIndex]];
          break;
      }

      switch (b.data[colIndex]) {
        case "Validée":
          bValue = valuesDictionary["Validee"];
          break;
        case "Refusée":
          bValue = valuesDictionary["Refusee"];
          break;
        default:
          // @ts-ignore
          bValue = valuesDictionary[b.data[colIndex]];
          break;
      }

      return (
          (aValue - bValue) * (order === "asc" ? 1 : -1)
      )
    }
    /*
    * 👉 6 = Date de création
    * */
    else if(colIndex == 6) {
      return (
         (moment(a.data[colIndex]).diff(b.data[colIndex]) < 0 ? -1 : 1) * (order === "asc" ? 1 : -1)
      )
    } else if (colIndex == 9) {
      return (
        (a.data[colIndex].firstname.toLowerCase() <
          b.data[colIndex].firstname.toLowerCase()
          ? -1
          : 1) * (order === "asc" ? 1 : -1)
      );
    } else if (colIndex == 11) {
      return (
        (a.data[4].name.toLowerCase() < b.data[4].name.toLowerCase() ? -1 : 1) *
        (order === "asc" ? 1 : -1)
      );
    } else {
      return (
        (a.data[colIndex] < b.data[colIndex] ? -1 : 1) *
        (order === "desc" ? 1 : -1)
      );
    }
  });
};

const setRowProps = (row: any) => {
  if (row[5] && row[5].props.children === "Nouvelle") {
    return {
      style: {
        background: "rgb(255 255 255)",
        boxShadow: "5px 5px 5px rgb(68 68 68 / 60%)",
      },
    };
  } else if (row[5].props.children === "En cours") {
    return {
      style: { background: "rgb(255 152 0 / 53%)" },
    };
  } else if (row[5].props.children === "Validée") {
    return {
      style: { background: "rgb(139 195 74 / 53%)" },
    };
  } else if (row[5].props.children === "Refusée") {
    return {
      style: { background: "rgb(229 104 104 / 80%)" },
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
        <td>
          <Card
            border="primary"
            style={{
              border: "1px solid grey",
              width: "25rem",
              margin: "10px 10px 10px 20px",
            }}
          >
            <Card.Body>
              <div>
                <label className="label">Description</label>
                <p>{rowData[4]}</p>
              </div>
            </Card.Body>
          </Card>
        </td>
        <td colSpan={6}>
          <Row style={{padding: '12px'}}>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {rowData[7] ? (
                <LightBox src={`${PUBLIC_API}${rowData[7]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[7]}`}
                    style={{ width: WIDTH_IMAGE, maxHeight: HEIGHT_IMAGE, boxShadow: '0px 8px 12px #afafaf', borderRadius: '4px' }}
                    alt={"photo"}
                  />
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 1</Typography>
              )}
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {rowData[8] ? (
                <LightBox src={`${PUBLIC_API}${rowData[8]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[8]}`}
                    style={{ width: WIDTH_IMAGE, maxHeight: HEIGHT_IMAGE, boxShadow: '0px 8px 12px #afafaf', borderRadius: '4px' }}
                    alt={"photo"}
                  />
                </LightBox>
              ) : (
                <Typography variant="subtitle1">Photo 2</Typography>
              )}
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {rowData[9] ? (
                <LightBox src={`${PUBLIC_API}${rowData[9]}`} alt={"lightBox"}>
                  <img
                    src={`${PUBLIC_API}${rowData[9]}`}
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
};

export { dataTableColumns, customSort, setRowProps, renderExpandableRow };
