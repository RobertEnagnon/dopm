import { Card, CardBody, CardHeader, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Row } from "reactstrap";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DataType, getYears, monthLabel, Ranges } from "../../utils/top5.utils";

type ChartProps = {
    name: string
    data: any,
    options: any,
    css?: any,
    dataType: DataType,
    date?: Date,
    setDate?: any,
    range? : number,
    setRange?: (range: number) => void
}

Chart.register(...registerables, ChartDataLabels);
Chart.defaults.scale.grid.display = false;

const ChartComponent = ({ name, data, options, css, dataType, date, setDate, range, setRange }: ChartProps) => {

    const onChangeDateHandler = (type: string, change: number) => {
        if (date != undefined && setDate != undefined) {
            let newDate: Date = new Date(date);
            if (type == 'year') {
                newDate.setFullYear(change);
            } else if (type == 'month') {
                newDate.setMonth(change);
            }

            setDate(newDate)
        }
    }

    // Workaround pour ne pas afficher la courbe de l'indicateur lorsque les données
    // ne sont pas encore renseignées
    let dataWithoutZero = { ...data };
    for (const d of dataWithoutZero.datasets)
        if (d.type === 'line')
            for (let i = 0; i < d.data.length; i++)
                if (d.data[i] === ' ' || d.data[i] === '' || d.data[i] === 0) d.data[i] = 'N/A'

    const bDisplayDate =  (date != undefined && setDate != undefined);  // affichage des mois
    const bDisplayRanges = range != undefined                           // affichage des semaines

    return (
        <Card>
            <CardHeader style={css?.CardHeader ?? {}}>
                {dataType == DataType.Data &&
                    <div className="card-actions float-right">

                        {/* Affichage mois */}
                        {bDisplayDate && <UncontrolledDropdown className="d-inline-block">
                            <DropdownToggle caret color="White"
                                            style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}>
                                {monthLabel[date!.getMonth()]}
                            </DropdownToggle>
                            <DropdownMenu right>
                                {monthLabel.map((m, i) => {
                                    return (
                                        <DropdownItem key={`${m}${i * Date.now()}`} onClick={() => onChangeDateHandler('month', i)}>{m}</DropdownItem>
                                    )
                                })}
                            </DropdownMenu>
                        </UncontrolledDropdown>}

                        {/* Affichage année */}
                        {bDisplayDate && <UncontrolledDropdown className="d-inline-block">
                            <DropdownToggle caret color="White"
                                            style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}>
                                {date!.getFullYear()}
                            </DropdownToggle>
                            <DropdownMenu right>
                                {getYears().map((year, i) => {
                                    return (
                                        <DropdownItem
                                            key={`${year}${i * Date.now()}`}
                                            onClick={() => onChangeDateHandler('year', parseInt(year))}
                                        >
                                            {year}
                                        </DropdownItem>
                                    );
                                })}
                            </DropdownMenu>
                        </UncontrolledDropdown>}

                        {/* Affichage Semaines glissantes */}
                        {bDisplayRanges &&
                            <Row>
                                <div>
                                    Semaines glissantes :
                                </div>
                                <UncontrolledDropdown className="d-inline-block">
                                    <DropdownToggle caret color="White"
                                                    style={{ fontSize: "0.9em", padding: "0", marginRight: "15px", marginLeft: "10px" }}>
                                        {range}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        {Ranges.map((range: number) => {
                                            return (
                                                <DropdownItem
                                                    key={range}
                                                    onClick={() => setRange!(range)}
                                                >
                                                    {range}
                                                </DropdownItem>
                                            );
                                        })}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Row>}

                    </div>
                }
                <CardTitle tag='h5' style={ css?.CardTitle ?? {}}>{name}</CardTitle>
            </CardHeader>
            <CardBody>
                <div className='chart'>
                    <Bar
                        style={{ height: '100%' }}
                        datasetIdKey={name}
                        data={dataWithoutZero}
                        options={options}
                    />
                </div>
            </CardBody>
        </Card>
    )
}

export default ChartComponent
