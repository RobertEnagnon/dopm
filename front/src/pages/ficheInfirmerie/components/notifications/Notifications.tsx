import {
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
} from "reactstrap";
import styles from "./notification.module.css";
import { useZone } from "../../../../hooks/zone";
import { useResponsible } from "../../../../hooks/responsible";
import { Zone } from "../../../../models/zone";
import { GetFSNotificationsPerZone, UpdateFSNotification } from "../../../../services/FicheInfirmerie/fiNotifications";
import { Notification } from "../../../../models/FicheInfirmerie/notification";

export default function Notifications() {
  const { zones } = useZone()
  const { responsibles } = useResponsible()
  const [selectedZone, setSelectedZone] = useState<Zone>()
  const [checkedResponsables, setCheckedResponsables] = useState<Array<number>>([]);

  const updateNotification = async (zone: number, responsible: number, isSubscribed: boolean) => {
    if (zone && responsible) {
      const data = await UpdateFSNotification(zone, responsible, isSubscribed)
      setCheckedResponsables(getResponsiblesIdsFromNotification(data))
    }
  }

  const getResponsiblesIdsFromNotification = (notifications: Array<Notification>) => {
    return notifications.map((notification: Notification) => {
      return notification.responsable_id
    })
  }

  useEffect(() => {
    if (selectedZone) {
      GetFSNotificationsPerZone(selectedZone.id)
      .then((r) => {
        setCheckedResponsables(getResponsiblesIdsFromNotification(r))
      })
    }
  }, [selectedZone]);

  return (
    <Container fluid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} sm={6}>
          <div style={{ minHeight: "500px", width: "100%" }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <Typography variant="h4" style={{ paddingLeft: "10px", fontSize: "1.7em" }}>Zones</Typography>
              </Grid>
              <Grid item style={{ width: "100%" }}>
                <Card style={{ height: "500px", width: "100%", overflowY: "auto", overflowX: "hidden" }}>
                  <CardBody>
                    <Grid
                      container
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={1}
                    >
                      {zones.map((zone) => {
                        if (!selectedZone) {
                          setSelectedZone(zones[0])
                        }
                        return (
                          <Grid key={zone.id} item style={{ width: "100%" }}>
                            <Typography
                              style={{
                                cursor: "pointer",
                                width: "100%",
                                borderBottom: "0.5px solid rgba(0,0,0,0.5)",
                              }}
                              onClick={() => {
                                setSelectedZone(zone)
                              }}
                              variant="subtitle1"
                            >
                              <div
                                className={
                                  zone.id === selectedZone?.id ? styles.selected : ""
                                }
                              >
                                {zone.name}
                              </div>
                            </Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardBody>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div style={{ minHeight: "500px", width: "100%" }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <Typography variant="h4" style={{ paddingLeft: "10px", fontSize: "1.7em" }}>Responsables</Typography>
              </Grid>
              <Grid item style={{ width: "100%" }}>
                <Card style={{ height: "500px", width: "100%", overflowY: "auto", overflowX: "hidden" }}>
                  <CardBody>
                    <Grid
                      container
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={1}
                    >
                      {responsibles.map((responsible) => {
                        return (
                          <Grid item key={responsible.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color="primary"
                                  onChange={(event) => {
                                    updateNotification(
                                      selectedZone?.id || 0,
                                      responsible.id,
                                      event.target.checked
                                    )
                                  }}
                                  checked={
                                    checkedResponsables.length > 0 &&
                                    checkedResponsables?.includes(responsible.id)
                                  }
                                />
                              }
                              label={`${responsible.firstname} ${responsible.lastname}`}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardBody>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
