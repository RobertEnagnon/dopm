import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { Row, Button, Card, CardBody, Col } from "reactstrap";
import Bar from "./Bar";
import {permissionsList} from "../../../models/Right/permission";
import {useUser} from "../../../components/context/user.context";

export default function Statistique() {
  const userContext = useUser();
  const currentPermissions = {
    lectureStatistiquesFicheSecurite: userContext.checkAccess(permissionsList.lectureStatistiquesFicheSecurite)
  };
  const [critere, setCritere] = useState<string>("");
  const [periode, setPeriode] = useState<string>("mensuel");

  if (!currentPermissions?.lectureStatistiquesFicheSecurite)
  {
    return (<p className="alert-panel">Permission insuffisante</p>);
  }

  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */
  // const handleChange = (val) => setValue(val);
  return (
    <>
      <Row >
        <Col md={{ size: 12, offset: 0 }} >
          <Card>
            <CardBody style={{ paddingTop: "10px" }}>
            <label
                className="label"
                style={{ display: "block" }}
              >
                <h3>Statistiques</h3>
              </label>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ height: "550px" }}
                spacing={1}
              >
                <Grid
                  container
                  item
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  md={2}
                  spacing={1}
                >
                  {" "}
                  <Grid item style={{ width: "100%" }}>
                    <Button
                      style={{ width: "100%" }}
                      variant="contained"
                      color="primary"
                      outline={periode === "mensuel" && critere === ""}
                      onClick={() => {
                        setPeriode("mensuel");
                        setCritere("");
                      }}
                    >
                      Mensuel
                    </Button>
                  </Grid>
                  <Grid item style={{ width: "100%" }}>
                    <Button
                      style={{ width: "100%" }}
                      outline={periode === "mensuel" && critere === "zone"}
                      variant="contained"
                      onClick={() => {
                        setPeriode("mensuel");
                        setCritere("zone");
                      }}
                      color="primary"
                    >
                      Mensuel/Zone
                    </Button>
                  </Grid>
                  <Grid item style={{ width: "100%" }}>
                    <Button
                      style={{ width: "100%" }}
                      variant="contained"
                      outline={periode === "mensuel" && critere === "status"}
                      onClick={() => {
                        setPeriode("mensuel");
                        setCritere("status");
                      }}
                      color="primary"
                    >
                      Mensuel/Status
                    </Button>
                  </Grid>
                  <Grid item style={{ width: "100%" }}>
                    <Button
                      style={{ width: "100%" }}
                      outline={periode === "annuel" && critere === ""}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setPeriode("annuel");
                        setCritere("");
                      }}
                    >
                      Annuel
                    </Button>
                  </Grid>
                  <Grid item style={{ width: "100%" }}>
                    <Button
                      style={{ width: "100%" }}
                      variant="contained"
                      outline={periode === "annuel" && critere === "zone"}
                      onClick={() => {
                        setPeriode("annuel");
                        setCritere("zone");
                      }}
                      color="primary"
                    >
                      Annuel/Zone
                    </Button>
                  </Grid>
                  <Grid item style={{ width: "100%" }}>
                    <Button
                      style={{ width: "100%" }}
                      variant="contained"
                      outline={periode === "annuel" && critere === "status"}
                      color="primary"
                      onClick={() => {
                        setPeriode("annuel");
                        setCritere("status");
                      }}
                    >
                      Annuel/Status
                    </Button>
                  </Grid>
                </Grid>
                <Grid item md={10}>
                  <Bar critere={critere} periode={periode} />
                </Grid>
              </Grid>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
