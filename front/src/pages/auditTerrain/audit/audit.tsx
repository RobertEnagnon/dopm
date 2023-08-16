import "./audit.scss";
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
import { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { useCheckpoint } from "../../../hooks/AuditTerrain/checkpoint";
import AddAuditForm from "../components/audit/addAudit/addAudit";
import { useAudit } from "../../../hooks/AuditTerrain/audit";
import ReadAudit from "../components/audit/readAudit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ModalComponent from "../../../components/layout/modal";
import EditAuditForm from "../components/audit/editAudit/editAudit";
import { notify, NotifyActions } from "../../../utils/dopm.utils";
import { User } from "../../../models/user";
import { useDopm } from "../../../components/context/dopm.context";
import AuditMobile from '../components/audit/ui-phone/auditMobile';

const Audit = () => {
  const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

  const dopmContext = useDopm();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [edition, setEdition] = useState<boolean>(false);
  const [mapView, setMapView] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>();

  const { services } = useService();
  const { checkpoints, setService, service } = useCheckpoint();
  const { audits, addAudit, editAudit, deleteAudit, auditMap } = useAudit(
    service,
    selectedDate
  );

  useEffect(() => {
    let userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      setCurrentUser(JSON.parse(userLocalStorage));
    }
  }, []);

  useEffect(() => {
    if (services.length > 0 && !service?.id) {
      setService(currentUser?.service || services[0]);
    }
  }, [services, currentUser]);

  const handleChangeService = (serviceId: number) => {
    if (serviceId)
      setService(services.find((service) => service.id === serviceId));
  };

  const handleDeleteAudit = async (auditId: number) => {
    const deletedItem = await deleteAudit(auditId);
    if (deletedItem.message) {
      setEdition(false);
      notify("Audit supprimé", NotifyActions.Successful);
    } else {
      notify("Suppression impossible", NotifyActions.Error);
    }
  };

  return (
    <>
      <ModalComponent open={edition} hide={() => setEdition(false)}>
        <EditAuditForm
          editAudit={editAudit}
          checkpoints={checkpoints}
          service={service!}
          date={selectedDate}
          audit={audits[0]}
          onDelete={handleDeleteAudit}
          closeModal={() => {
            setEdition(false);
          }}
        />
      </ModalComponent>
      {auditMap && auditMap.image && (
        <ModalComponent open={mapView} hide={() => setMapView(false)}>
          <Card>
            <CardBody>
              <img
                src={`${PUBLIC_API}/${auditMap.image}`}
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
      {dopmContext.isMobileDevice ? <AuditMobile
        services={services}
        service={service}
        handleChangeService={handleChangeService}
        audits={audits}
        addAudit={addAudit}
        checkpoints={checkpoints}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setMapView={setMapView}
      /> : <Row>
        <Col md={9}>
          <Card>
            <CardHeader
              style={{ paddingBottom: "0.2rem" }}
              className="bg-white"
            >
              <CardTitle tag="h3" style={{ margin: "0" }}>
                <span style={{ fontSize: "1.2rem" }}>
                  Checkpoints {service?.name}
                </span>
                <div
                  className="card-actions float-right"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {audits?.length ? (
                    <div style={{ margin: "8px", cursor: "pointer" }}>
                      <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => setEdition(true)}
                      />
                    </div>
                  ) : null}
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
                      {service?.name}
                    </DropdownToggle>
                    <DropdownMenu right>
                      {services.map((service) => {
                        return (
                          <DropdownItem
                            key={`serv${service.id * Date.now()}`}
                            onClick={() => handleChangeService(service.id)}
                          >
                            {service.name}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </CardTitle>
            </CardHeader>
            {audits?.length ? (
              < ReadAudit audit={audits[0]} />
            ) : (
              <>
                {checkpoints.length !== 0 && (
                  <AddAuditForm
                    addAudit={addAudit}
                    checkpoints={checkpoints}
                    service={service!}
                    date={selectedDate}
                  />
                )}
              </>
            )}
          </Card>
        </Col>
        <Col md={3}>
          <Row>
            <Col>
              <Card>
                <CardHeader className="bg-white">
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
                <CardHeader className="bg-white">
                  <CardTitle tag="h3" className="m-0">
                    Carte Usine
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {auditMap && auditMap.image && (
                    <img
                      src={`${PUBLIC_API}/${auditMap.image}`}
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
      </Row>}
    </>
  );
};

export default Audit;
