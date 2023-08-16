import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { useService } from "../../../hooks/service";
import { useCheckpoint } from "../../../hooks/AuditTerrain/checkpoint";
import { useEffect, useState } from "react";
import { useAudit } from "../../../hooks/AuditTerrain/audit";
import { DatePickerCalendar } from "react-nice-dates";
import { fr } from "date-fns/locale";
import ModalComponent from "../../../components/layout/modal";
import { Checkpoint } from "../../../models/AuditTerrain/checkpoint";
import CheckpointRow from "../components/checkpoint/checkpointRow";
import AuditRow from "../components/audit/auditRow";
import { User } from "../../../models/user";
import { hasToBeDisplayed } from "../../../services/period";

const ATFaceToFace = () => {
  const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mapView, setMapView] = useState<boolean>(false);
  const [checkpointsToView, setCheckpointsToView] = useState<Array<Checkpoint>>(
    []
  );
  const [currentUser, setCurrentUser] = useState<User>();

  const { services } = useService();
  const AuditCheckpointA = useCheckpoint();
  const AuditCheckpointB = useCheckpoint();

  const AuditA = useAudit(AuditCheckpointA.service, selectedDate);
  const AuditB = useAudit(AuditCheckpointB.service, selectedDate);

  useEffect(() => {
    let userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      setCurrentUser(JSON.parse(userLocalStorage));
    }
  }, []);

  useEffect(() => {
    if (services.length > 0 && !AuditCheckpointA.service?.id) {
      AuditCheckpointA.setService(currentUser?.service || services[0]);
    } else {
      AuditCheckpointA.setService(undefined);
    }
  }, [services, currentUser]);

  useEffect(() => {
    if (AuditCheckpointA.availableServices.length > 0) {
      AuditCheckpointB.setService(AuditCheckpointA.availableServices[0]);
    } else {
      AuditCheckpointB.setService(undefined);
    }
  }, [AuditCheckpointA.availableServices]);

  useEffect(() => {
    let tempCheckpoints: Array<Checkpoint> = [];

    if (AuditCheckpointB.service?.id) {
      AuditCheckpointA.checkpoints.forEach((checkpoint) => {
        if (
          AuditCheckpointB.checkpoints.filter((c) => checkpoint.id === c.id)
            .length > 0
        ) {
          tempCheckpoints.push(checkpoint);
        }
      });
      AuditCheckpointB.checkpoints.forEach((checkpoint) => {
        if (
          AuditCheckpointA.checkpoints.filter((c) => checkpoint.id === c.id)
            .length > 0 &&
          tempCheckpoints.filter((c) => checkpoint.id === c.id).length == 0
        ) {
          tempCheckpoints.push(checkpoint);
        }
      });

      tempCheckpoints.forEach((c) => {
        c.color = checkValuesCheckpoint(c);
      });
    } else {
      tempCheckpoints = [...AuditCheckpointA.checkpoints];
    }

    tempCheckpoints = tempCheckpoints.filter((checkpoint: any) => {
      return (
        !checkpoint.period ||
        hasToBeDisplayed(
          checkpoint.updatedAt,
          selectedDate.toString(),
          checkpoint.period
        )
      );
    });
    setCheckpointsToView(
      tempCheckpoints.sort((a, b) => {
        return a.numero - b.numero;
      })
    );
  }, [
    AuditCheckpointA.checkpoints,
    AuditCheckpointB.checkpoints,
    AuditA.audits,
    AuditB.audits,
  ]);

  const checkValuesCheckpoint = (checkpoint: Checkpoint) => {
    const auditsA = AuditA.audits[0];
    const auditsB = AuditB.audits[0];

    const valueAuditA = auditsA?.Evaluations?.find(
      (ae) => ae.checkpoint?.id === checkpoint.id
    );
    const valueAuditB = auditsB?.Evaluations?.find(
      (ae) => ae.checkpoint?.id === checkpoint.id
    );

    if (valueAuditA && valueAuditB) {
      if (valueAuditA?.check === valueAuditB?.check) {
        return "#28A74533";
      } else {
        return "#DC354533";
      }
    } else {
      return "#FFF";
    }
  };

  const handleChangeService = (audit: "A" | "B", serviceId: number) => {
    if (serviceId) {
      switch (audit) {
        case "A":
          AuditCheckpointA.setService(
            services.find((service) => service.id === serviceId)
          );
          break;
        case "B":
          AuditCheckpointB.setService(
            services.find((service) => service.id === serviceId)
          );
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      {AuditA.auditMap && AuditA.auditMap.image && (
        <ModalComponent open={mapView} hide={() => setMapView(false)}>
          <Card>
            <CardBody>
              <img
                src={`${PUBLIC_API}/${AuditA.auditMap.image}`}
                alt="auditPlantMap"
                style={{
                  height: "100%",
                  width: "100%",
                  padding: "12px",
                }}
              />
            </CardBody>
          </Card>
        </ModalComponent>
      )}
      <Row>
        <Col md={9}>
          <Card>
            <CardHeader style={{ paddingBottom: "0.2rem" }}>
              <CardTitle tag="h3" style={{ margin: "0" }}>
                <span style={{ fontSize: "1.2rem" }}>Face to Face</span>
                <div
                  className="card-actions float-right"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {/* CONTROLE SERVICE 1/A */}
                  <UncontrolledDropdown className="d-inline-block">
                    <DropdownToggle
                      caret
                      color="white"
                      style={{
                        fontSize: "0.9em",
                        padding: "0",
                        marginRight: "6px",
                      }}
                    >
                      {AuditCheckpointA.service?.name}
                    </DropdownToggle>
                    <DropdownMenu right>
                      {services.map((service) => {
                        return (
                          <DropdownItem
                            key={`servA${service.id * Date.now()}`}
                            onClick={() => handleChangeService("A", service.id)}
                          >
                            {service.name}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  {/* CONTROLE SERVICE 2/B */}
                  {AuditCheckpointA.availableServices.length > 0 && (
                    <UncontrolledDropdown className="d-inline-block">
                      <DropdownToggle
                        caret
                        color="white"
                        style={{
                          fontSize: "0.9em",
                          padding: "0",
                          marginRight: "6px",
                        }}
                      >
                        {AuditCheckpointB.service?.name}
                      </DropdownToggle>
                      <DropdownMenu right>
                        {AuditCheckpointA.availableServices.map((service) => {
                          return (
                            <DropdownItem
                              key={`servB${service.id * Date.now()}`}
                              onClick={() =>
                                handleChangeService("B", service.id)
                              }
                            >
                              {service.name}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={8} />
                <Col md={2} className="text-center font-weight-bold">
                  {AuditCheckpointA.service?.name}
                </Col>
                <Col md={2} className="text-center font-weight-bold">
                  {AuditCheckpointB.service?.name}
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <CheckpointRow checkpoints={checkpointsToView} />
                </Col>
                <Col md={2}>
                  <AuditRow
                    checkpoints={checkpointsToView}
                    audit={AuditA.audits[0]}
                  />
                </Col>
                {AuditCheckpointB.service?.id && (
                  <Col md={2}>
                    <AuditRow
                      checkpoints={checkpointsToView}
                      audit={AuditB.audits[0]}
                    />
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CardTitle tag="h3" className="m-0">
                    Calendrier
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <DatePickerCalendar
                    date={selectedDate}
                    onDateChange={(date) => setSelectedDate(date ?? new Date())}
                    locale={fr}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CardTitle tag="h3" className="m-0">
                    Carte Usine
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {AuditA.auditMap && AuditA.auditMap.image && (
                    <img
                      src={`${PUBLIC_API}/${AuditA.auditMap.image}`}
                      alt="auditPlantMap"
                      style={{
                        height: "100%",
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => setMapView(true)}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ATFaceToFace;
