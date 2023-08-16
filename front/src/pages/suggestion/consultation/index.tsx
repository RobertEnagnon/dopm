import { Row, Card, Col, CardBody } from "reactstrap";
import TableConsulation from "./TableConsultation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Grid } from "@material-ui/core";
import { useSuggestion } from "../../../hooks/suggestion";

export default function Index() {
  const { suggestions } = useSuggestion();

  const handleDeleteSuggestion = async (id: number) => {
    await console.log(id);
  };

  return (
    <>
      <Card>
        <CardBody>
          <Row style={{ paddingTop: "10px" }}>
            <Col md="3">
              <label className="label" style={{ display: "block" }}>
                <h3>Liste Suggestions</h3>
              </label>
            </Col>
            <Col md="9">
              <Grid item>
                <div
                  className="aligntR"
                  style={{
                    float: "right",
                    display: "flex",
                    paddingTop: "5px",
                    paddingRight: "20px",
                  }}
                >
                  <h4>Status : &nbsp;</h4>
                  <label>
                    <FontAwesomeIcon
                      style={{ color: "#efefef" }}
                      icon={faCircle}
                      className="align-middle mr-2 btn-icon"
                    />
                    Nouvelle
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <FontAwesomeIcon
                      style={{ color: "#ff9800" }}
                      icon={faCircle}
                      className="align-middle mr-2 btn-icon"
                    />
                    En cours
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <FontAwesomeIcon
                      style={{ color: "#8bc34a" }}
                      icon={faCircle}
                      className="align-middle mr-2 btn-icon"
                    />
                    Validée
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <FontAwesomeIcon
                      style={{ color: "#E56868" }}
                      icon={faCircle}
                      className="align-middle mr-2 btn-icon"
                    />
                    Refusée
                  </label>
                </div>
              </Grid>
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 12, offset: 0 }}>
              <Grid item style={{ width: "100%" }}>
                <TableConsulation
                  deleteSuggestion={handleDeleteSuggestion}
                  suggestions={suggestions}
                />
              </Grid>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
