import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle, ListGroup,
    Row,
    UncontrolledDropdown
} from "reactstrap";
import {useService} from "../../../hooks/service";
import {useEffect, useState} from "react";
import {User} from "../../../models/user";
import {Service} from "../../../models/service";
import {useAudit} from "../../../hooks/AuditTerrain/audit";
import {Color} from "../../../utils/dopm.utils";
import { Bar } from "react-chartjs-2";
import {Chart, registerables} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getYears} from "../../../utils/top5.utils";

Chart.register(...registerables, ChartDataLabels);
Chart.defaults.scale.grid.display = false;

const MONTHS = [
    { number: 0, label: 'Janvier' },
    { number: 1, label: 'Février' },
    { number: 2, label: 'Mars' },
    { number: 3, label: 'Avril' },
    { number: 4, label: 'Mai' },
    { number: 5, label: 'Juin' },
    { number: 6, label: 'Juillet' },
    { number: 7, label: 'Août' },
    { number: 8, label: 'Septembre' },
    { number: 9, label: 'Octobre' },
    { number: 10, label: 'Novembre' },
    { number: 11, label: 'Décembre' }
]

const StatisticsCard = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date)
    const [currentUser, setCurrentUser] = useState<User>();

    const [displayService, setDisplayService] = useState<boolean>(true);
    const [displayMonth, setDisplayMonth] = useState<boolean>(false);
    const [displayYear, setDisplayYear] = useState<boolean>(false);
    const [currentService, setCurrentService] = useState<Service>();
    const [currentEndpoint, setCurrentEndpoint] = useState<string>('Pareto');

    const [datas, setDatas] = useState<any>();
    const [options, setOptions] = useState<any>(undefined);

    const { services } = useService();
    const { getParetoDiagram, getNokByMonth, getNokByYear, getNokByZone, getAnnuelByZone, getAnnuelByStatus } = useAudit(currentService, selectedDate);

    const AVAILABLE_STATS = [{
        label: 'Pareto',
        endpoint: async () => {
            let res = await getParetoDiagram();
            if( res ) {
                setCurrentEndpoint('Pareto');
                setDisplayService(true);
                setDisplayMonth(false);
                setDisplayYear(true);
                fetchData('Nbr NOK / Checkpoint', res);
            }
        }
    }, {
        label: 'Checkpoints NOK / Mois',
        endpoint: async () => {
            let res = await getNokByMonth();
            if( res ) {
                setCurrentEndpoint('Checkpoints NOK / Mois');
                setDisplayService(false);
                setDisplayMonth(true);
                setDisplayYear(true);
                fetchData('Checkpoints NOK / Mois', res);
            }
        }
    }, {
        label: 'Checkpoints NOK / An',
        endpoint: async () => {
            let res = await getNokByYear();
            if( res ) {
                setCurrentEndpoint('Checkpoints NOK / An');
                setDisplayService(false);
                setDisplayMonth(false);
                setDisplayYear(true);
                fetchData('Checkpoints NOK / An', res);
            }
        }
    }, {
        label: 'Checkpoints NOK / Zone',
        endpoint: async () => {
            let res = await getNokByZone();
            if( res ) {
                setCurrentEndpoint('Checkpoints NOK / Zone');
                setDisplayService(true);
                setDisplayMonth(true);
                setDisplayYear(true);
                fetchData('Checkpoints NOK / Zone', res);
            }
        }
    }, {
        label: 'Checkpoints OK Annuels / Zone',
        endpoint: async () => {
            let res = await getAnnuelByZone();
            if( res ) {
                setCurrentEndpoint('Annuel / Zone');
                setDisplayService(false);
                setDisplayMonth(false);
                setDisplayYear(true);
                fetchData('Checkpoints Annuels / Zone', res)
            }
        }
    }, {
        label: 'Taux Conformité / Zone',
        endpoint: async () => {
            let res = await getAnnuelByStatus();
            if( res ) {
                setCurrentEndpoint('Annuel / Status');
                setDisplayService(true);
                setDisplayMonth(false);
                setDisplayYear(true);
                fetchData('Checkpoints Annuels / Status', res, [{
                    label: 'Taux de conformité',
                    type: 'line',
                    yAxisID: 'per',
                    data: res.map((d: any) => d.txc),
                    backgroundColor: Color.blue,
                    borderColor: Color.blue,
                    hoverBackgroundColor: Color.blue,
                    hoverBorderColor: Color.blue,
                    datalabels: {
                        color: function (context: any) {
                            const index = context.dataIndex;
                            const value = context.dataset.data[index];
                            /**
                             * Trois cas de figure pour la couleur
                             * 1: value == " " alors parseInt => Naan -> couleur transparente
                             * 2: value == "0" -> couleur #000
                             * 3: value != " " && value != "0" -> couleur #fff ( Le cas ou on a une valeur )
                             */
                            const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? 'transparent': Color.black
                            return color
                        },
                        anchor: "end",
                        align: "end",
                    }
                },
                {
                    label: 'NOK',
                    yAxisID: "chk",
                    data: res.map((d: any) => d.nok),
                    backgroundColor: Color.red,
                    borderColor: Color.red,
                    hoverBackgroundColor: Color.red,
                    hoverBorderColor: Color.red,
                    datalabels: {
                        color: function (context: any) {
                            const index = context.dataIndex;
                            const value = context.dataset.data[index];
                            /**
                             * Trois cas de figure pour la couleur
                             * 1: value == " " alors parseInt => Naan -> couleur transparente
                             * 2: value == "0" -> couleur #000
                             * 3: value != " " && value != "0" -> couleur #fff ( Le cas ou on a une valeur )
                             */
                            const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                            return color
                        },
                    },
                }, {
                    label: 'OK',
                    yAxisID: "chk",
                    data: res.map((d: any) => d.ok),
                    backgroundColor: Color.green,
                    borderColor: Color.green,
                    hoverBackgroundColor: Color.green,
                    hoverBorderColor: Color.green,
                    datalabels: {
                        color: function (context: any) {
                            const index = context.dataIndex;
                            const value = context.dataset.data[index];
                            /**
                             * Trois cas de figure pour la couleur
                             * 1: value == " " alors parseInt => Naan -> couleur transparente
                             * 2: value == "0" -> couleur #000
                             * 3: value != " " && value != "0" -> couleur #fff ( Le cas ou on a une valeur )
                             */
                            const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                            return color
                        },
                    },
                }], {
                    scales: {
                        per: {
                            type: 'linear',
                            position: 'right',
                            ticks: { beginAtZero: true },
                            grid: { display: false },
                        },
                        chk: {
                            type: 'linear',
                            position: 'left',
                            ticks: { beginAtZero: true },
                            grid: { display: false },
                        },
                    }
                });
            }
        }
    }]

    useEffect(() => {
        let userLocalStorage = localStorage.getItem('user');
        if( userLocalStorage ) {
            setCurrentUser( JSON.parse( userLocalStorage ) );
        }
        setSelectedDate(new Date());
    }, [])

    useEffect(() => {
        if( services.length > 0 && !currentService?.id ) {
            setCurrentService(currentUser?.service || services[0]);
        }
    }, [services, currentUser])

    useEffect(() => {
        const endpoint = AVAILABLE_STATS.find(endpt => endpt.label === currentEndpoint);
        if(endpoint) {
            endpoint.endpoint();
        }
    }, [selectedDate, currentService])

    const handleChangeService = (serviceId: number) => {
        if (serviceId) {
          setCurrentService(services.find(service => service.id === serviceId));
        } else {
          setCurrentService({
              id: 0,
              name: 'TOUS'
          })
        }
    }

    const fetchData = (label: string, res: any, customDatasets?: any, opt: any = undefined) => {
        let datasets = customDatasets || [{
            label: label,
            data: res.map((d: any) => d.value),
            backgroundColor: Color.blue,
            borderColor: Color.blue,
            hoverBackgroundColor: Color.blue,
            hoverBorderColor: Color.blue,
            datalabels: {
                color: function (context: any) {
                    const index = context.dataIndex;
                    const value = context.dataset.data[index];
                    /**
                     * Trois cas de figure pour la couleur
                     * 1: value == " " alors parseInt => Naan -> couleur transparente
                     * 2: value == "0" -> couleur #000
                     * 3: value != " " && value != "0" -> couleur #fff ( Le cas ou on a une valeur )
                     */
                    const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                    return color
                },
            },
        }]

        if( res ) {
            let datas = {
                labels: res.map((d: any) => d.checkpoint),
                datasets: datasets
            }

            if(opt) {
                setOptions(opt);
            } else {
                setOptions(undefined);
            }
            setDatas(datas);
        }
    }

    return (
        <Row>
            <Col md={2}>
                <Card style={{padding: '0.5rem 0'}}>
                    <CardBody>
                        <ListGroup style={{ display: "flex", gap: "1rem" }}>
                            {AVAILABLE_STATS.map(stat => {
                                return (
                                    <Row>
                                        <Col>
                                            <Button block color="primary" onClick={stat.endpoint}>{stat.label}</Button>
                                        </Col>
                                    </Row>
                                )
                            })}
                        </ListGroup>
                    </CardBody>
                </Card>
            </Col>
            <Col md={10}>
                <Card>
                    <CardHeader style={{paddingBottom: '0.2rem'}} className="bg-white">
                        <CardTitle tag='h3' style={{margin: '0'}}>
                            <span style={{fontSize: '1.2rem'}}>Statistiques</span>
                            {displayYear &&
                                <div className='card-actions float-right' style={{display: 'flex', alignItems: 'center'}}>
                                    <UncontrolledDropdown className='d-inline-block'>
                                        <DropdownToggle caret color='white'
                                                        style={{fontSize: '0.9em', padding: '0', marginRight: '6px'}}>
                                            {selectedDate.getFullYear()}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            {getYears().map((year) => {
                                                return (
                                                    <DropdownItem
                                                        key={`yr${Number(year)*Date.now()}`}
                                                        onClick={() => setSelectedDate(
                                                            new Date(Number(year), new Date().getMonth())
                                                        )}
                                                    >{year}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            }
                            {displayMonth &&
                                <div className='card-actions float-right' style={{display: 'flex', alignItems: 'center'}}>
                                    <UncontrolledDropdown className='d-inline-block'>
                                        <DropdownToggle caret color='white'
                                                        style={{fontSize: '0.9em', padding: '0', marginRight: '6px'}}>
                                            {MONTHS[selectedDate.getMonth()].label}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            {MONTHS.map((month) => {
                                                return (
                                                    <DropdownItem
                                                        key={`mth${month.number+Date.now()}`}
                                                        onClick={() => setSelectedDate(
                                                            new Date(new Date().getFullYear(), month.number)
                                                        )}
                                                    >{month.label}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>

                            }
                            {displayService &&
                                <div className='card-actions float-right' style={{display: 'flex', alignItems: 'center'}}>
                                    <UncontrolledDropdown className='d-inline-block'>
                                        <DropdownToggle caret color='white'
                                                        style={{fontSize: '0.9em', padding: '0', marginRight: '6px'}}>
                                            {currentService?.name}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem key={`servAnalysis${0.1 * Date.now()}`} onClick={() => handleChangeService(0)}>TOUS</DropdownItem>
                                            {services.map((service) => {
                                                return (
                                                    <DropdownItem key={`servStats${service.id * Date.now()}`}
                                                                  onClick={() => handleChangeService(service.id)}>{service.name}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {datas && <Bar style={{height: '100%'}} data={datas} options={options || {}} />}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default StatisticsCard;
