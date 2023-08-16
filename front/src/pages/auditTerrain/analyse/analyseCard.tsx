import {
    Card,
    CardBody,
    CardHeader,
    CardTitle, Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle, Row,
    UncontrolledDropdown
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import CheckpointRow from "../components/checkpoint/checkpointRow";
import AuditRow from "../components/audit/auditRow";
import {useEffect, useState} from "react";
import {User} from "../../../models/user";
import {useService} from "../../../hooks/service";
import {useCheckpoint} from "../../../hooks/AuditTerrain/checkpoint";
import {useAudit} from "../../../hooks/AuditTerrain/audit";

const AnalyseCard = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [dates, setDates] = useState<Array<Date>>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentUser, setCurrentUser] = useState<User>();

    const { services } = useService();
    const { checkpoints, setService, service } = useCheckpoint();

    /* Différents Audits => Day 1 to 5 of a week */
    const AuditDay1 = useAudit(service, dates[0]);
    const AuditDay2 = useAudit(service, dates[1]);
    const AuditDay3 = useAudit(service, dates[2]);
    const AuditDay4 = useAudit(service, dates[3]);
    const AuditDay5 = useAudit(service, dates[4]);

    useEffect(() => {
        let userLocalStorage = localStorage.getItem('user');
        if( userLocalStorage ) {
            setCurrentUser( JSON.parse( userLocalStorage ) );
        }

        setSelectedDate(moment(new Date).startOf('week').toDate());
    }, [])

    useEffect(() => {
        if( services.length > 0 && !service?.id ) {
            setService(currentUser?.service || services[0]);
        }
    }, [services, currentUser])

    useEffect(() => {
        let datesToSave = [moment(selectedDate).toDate()];
        for( let i = 1; i < 5; i++ ) {
            datesToSave.push( moment(selectedDate).add(i, 'day').toDate());
        }

        setDates(datesToSave);
    }, [selectedDate])

    useEffect(() => {
        if( AuditDay1.audits != undefined && AuditDay2.audits != undefined && AuditDay3.audits != undefined && AuditDay4.audits != undefined && AuditDay5.audits != undefined ) {
            setLoading(false);
        }
    }, [ AuditDay1.audits, AuditDay2.audits, AuditDay3.audits, AuditDay4.audits, AuditDay5.audits ])

    const handleChangeService = (serviceId: number) => {
        if (serviceId) setService(services.find(service => service.id === serviceId));
    }

    const handleChangeWeek = (action: 'next'|'prev') => {
        let now = moment(selectedDate)

        switch (action) {
            case "next":
                setSelectedDate(() => now.startOf('week').add(1, 'week').toDate());
                break;
            case "prev":
                setSelectedDate(() => now.startOf('week').subtract(1, 'week').toDate());
                break;
        }
    }

    return (
        <Card>
            <CardHeader style={{paddingBottom: '0.2rem'}} className="bg-white">
                <CardTitle tag='h3' style={{margin: '0'}}>
                    <span style={{fontSize: '1.2rem'}}>Analyse</span>
                    <div className='card-actions float-right' style={{display: 'flex', alignItems: 'center'}}>
                        <UncontrolledDropdown className='d-inline-block'>
                            <DropdownToggle caret color='white'
                                            style={{ fontSize: '0.9em', padding: '0', marginRight: '6px' }}>
                                {service?.name}
                            </DropdownToggle>
                            <DropdownMenu right>
                                {services.map((service) => {
                                    return (
                                        <DropdownItem key={`servAnalysis${service.id * Date.now()}`} onClick={() => handleChangeService(service.id)}>{service.name}</DropdownItem>
                                    )
                                })}
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <div style={{
                            margin: '0 1rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <FontAwesomeIcon icon={faArrowLeft} onClick={()=>handleChangeWeek('prev')} />
                            <div style={{margin: '0 4px'}}>Semaine n°{moment(selectedDate).week()} - {selectedDate?.getFullYear()}</div>
                            <FontAwesomeIcon icon={faArrowRight} onClick={()=>handleChangeWeek('next')} />
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardBody>
                {!loading &&
                    <>
                        <Row>
                          <Col md={5} />
                          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {AuditDay1 && <h5>{moment(dates[0]).format('ll')}</h5>}
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {AuditDay2 && <h5>{moment(dates[1]).format('ll')}</h5>}
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {AuditDay3 && <h5>{moment(dates[2]).format('ll')}</h5>}
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {AuditDay4 && <h5>{moment(dates[3]).format('ll')}</h5>}
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {AuditDay5 && <h5>{moment(dates[4]).format('ll')}</h5>}
                          </Col>
                        </Row>
                        <Row>
                            <Col md={5}>
                                <CheckpointRow checkpoints={checkpoints}/>
                            </Col>
                            <Col>
                                {AuditDay1 && <AuditRow checkpoints={checkpoints} audit={AuditDay1.audits[0]} date={dates[0]}/>}
                            </Col>
                            <Col>
                                {AuditDay2 && <AuditRow checkpoints={checkpoints} audit={AuditDay2.audits[0]} date={dates[1]}/>}
                            </Col>
                            <Col>
                                {AuditDay3 && <AuditRow checkpoints={checkpoints} audit={AuditDay3.audits[0]} date={dates[2]}/>}
                            </Col>
                            <Col>
                                {AuditDay4 && <AuditRow checkpoints={checkpoints} audit={AuditDay4.audits[0]} date={dates[3]}/>}
                            </Col>
                            <Col>
                                {AuditDay5 && <AuditRow checkpoints={checkpoints} audit={AuditDay5.audits[0]} date={dates[4]}/>}
                            </Col>
                        </Row>
                    </>
                }
            </CardBody>
        </Card>
    )
}

export default AnalyseCard;
