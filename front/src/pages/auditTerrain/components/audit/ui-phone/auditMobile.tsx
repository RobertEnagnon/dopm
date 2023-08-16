import { Row, Col, Card, CardHeader, CardTitle, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from "reactstrap";
import { Service } from "../../../../../models/service";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { Audit } from "../../../../../models/AuditTerrain/audit";
import ReadAuditMobile from "./readAuditMobile";
import { Checkpoint } from "../../../../../models/AuditTerrain/checkpoint";
import AddAuditFormMobile from "./addAuditMobile";

const AuditMobile = (props: {
    services: Service[],
    service: Service | undefined,
    handleChangeService: (serviceId: number) => void,
    audits: Audit[],
    addAudit: (audit: Audit) => Promise<any>,
    checkpoints: Checkpoint[],
    selectedDate: Date,
    setSelectedDate: Dispatch<SetStateAction<Date>>,
    setMapView: Dispatch<SetStateAction<boolean>>
}) => {

    const convertDate = (date: Date) => {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        return date.getFullYear() + "-" + (month) + "-" + (day);
    }

    const { services, service, handleChangeService, audits, addAudit, checkpoints, selectedDate, setSelectedDate, setMapView } = props;

    return (
        <Card>
            <CardHeader
                style={{ paddingBottom: "0.2rem" }}
                className="bg-white"
            >
                <CardTitle tag="h3" style={{ margin: "0" }}>
                    <Row className="card-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Col xs={{ size: 'auto', }} className="text-center" style={{ padding: "0" }}>
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    caret
                                    color="white"
                                    style={{
                                        fontSize: "0.8em",
                                        padding: "0",
                                        marginRight: "6px",
                                    }}
                                >
                                    {service?.name}
                                </DropdownToggle>
                                <DropdownMenu right >
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
                        </Col>

                        <Col xs={{ size: 'auto', }} style={{ padding: "0", }}>
                            <Input
                                autoComplete="off"
                                type="date"
                                value={convertDate(selectedDate)}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                style={{ fontSize: "0.9rem", }}
                            />
                        </Col>
                        <Col className="text-center" xs={{ size: 'auto', }} style={{ padding: "0" }}>
                            <FontAwesomeIcon
                                icon={faMap}
                                onClick={() => setMapView(true)}
                                style={{ width: "20px", height: "20px" }}
                            />
                        </Col>
                    </Row>
                </CardTitle>
            </CardHeader>
            {audits?.length ? (
                < ReadAuditMobile audit={audits[0]} />
            ) : (
                <>
                    {checkpoints.length !== 0 && (
                        <AddAuditFormMobile
                            addAudit={addAudit}
                            checkpoints={checkpoints}
                            service={service!}
                            date={selectedDate}
                        />
                    )}
                </>
            )}
        </Card >
    );
}

export default AuditMobile;