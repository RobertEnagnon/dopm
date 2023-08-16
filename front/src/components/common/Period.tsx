import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useState } from "react";
import * as yup from 'yup';
import { setLocale } from 'yup'
import { PeriodType, PeriodEnum } from "../../models/period"

setLocale({
    number: {
        integer: 'Doit être une valeur entière!',
        min: 'Doit être supérieu à 1!',
        positive: 'Doit être supérieur à 0!'
    },
});

const daysOfTheWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const ranks = ['Premier', 'Second', 'Troisième', 'Dernier']
const monthes = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

interface PropsType {
    period: PeriodType,
    error: string[],
    // eslint-disable-next-line no-unused-vars
    onPeriodModified: (period: PeriodType) => void,
    // eslint-disable-next-line no-unused-vars
    onError: (error: string[]) => void
}

const Period = ({ period, error, onError, onPeriodModified }: PropsType) => {

    // Boolean pour si on s'intéresse au nombre de jours ou au rang du jour
    // Uniquement pour les mois et les années
    const [numericMode, setNumericMode] = useState<boolean>(!isNaN(parseInt(period.rank ? period.rank : '')))

    // Modification du type de période: 'Quotidienne', 'Hebdomadaire' etc..
    const handleClickPeriodEnum = (enumPeriod: number) => {

        let newPeriod: PeriodType = {
            periodEnum: enumPeriod,
            every: 1,
        }

        if (enumPeriod === PeriodEnum.mensuelle) {
            newPeriod.rank = '1'
            setNumericMode(true)
        }

        else if (enumPeriod === PeriodEnum.annuelle) {
            newPeriod.rank = '1'
            newPeriod.month = 'Janvier'
            setNumericMode(true)
        }

        onPeriodModified(newPeriod)
        onError(['', ''])
    }

    // Modification du jour de la semaine: 'Lundi', 'Mardi' etc..
    const handleClickDay = (day: string, clear = false) => {

        let newPeriod = { ...period }
        if (!newPeriod.day || clear) newPeriod.day = []

        if (newPeriod.day.includes(day)) newPeriod.day = newPeriod.day.filter(d => d !== day)
        else newPeriod.day.push(day)

        onPeriodModified(newPeriod)
    }

    // Modification du rang (fréquence dans le mois), ex: le 1, le 2, le 26 etc...
    // ou le 'Premier', le 'Dernier' etc...
    const handleClickRank = (rank: string) => {
        let newPeriod = { ...period }
        newPeriod.rank = rank;
        onPeriodModified(newPeriod)
    }

    // Modification du mois: 'Janvier', 'Juillet' etc ..
    // Pour la périodicité annuelle
    const handleClickMonth = (month: string) => {
        let newPeriod = { ...period }
        newPeriod.month = month;
        onPeriodModified(newPeriod)
    }

    // Vérifier la fréquence de la période
    const handleValidateEvery = (every: number, firstRow = true): void => {
        const validationSchema = yup.object().shape({
            every: yup.number().positive().min(1).integer().required()
        })

        let newPeriod = { ...period }
        newPeriod.every = every

        validationSchema
            .validate(newPeriod)
            .then(function () {
                let schemaErr = [...error]
                if (firstRow) schemaErr[0] = ''
                else schemaErr[1] = ''
                onError(schemaErr)
                onPeriodModified(newPeriod)
            })
            .catch(function (err: yup.ValidationError) {
                let schemaErr = [...error]
                if (firstRow) schemaErr[0] = err.errors[0]
                else schemaErr[1] = err.errors[0]
                onError(schemaErr)
            });
    }

    const printError = (line = 0) => {
        return error[line] !== '' && <p style={{ color: 'red', marginLeft: '1em' }}>{error[line]}</p>
    }

    console.log('period', period)
    return (
        <>
            <Row>
                <p>Périodicité :</p>
                <div style={{ flexGrow: '1', marginLeft: '1em', marginTop: '0.75em', height: '1px', backgroundColor: 'grey' }} />
            </Row>
            <Row>
                {/* Périodicité */}
                <Col xs='3' className="border-right">
                    <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Label check>
                                <Input
                                    defaultChecked={period.periodEnum === PeriodEnum.quotidienne}
                                    type="radio"
                                    name="radio1"
                                    onClick={() => handleClickPeriodEnum(PeriodEnum.quotidienne)}
                                /> Quotidienne
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    defaultChecked={period.periodEnum === PeriodEnum.hebdomadaire}
                                    type="radio"
                                    name="radio1"
                                    onClick={() => handleClickPeriodEnum(PeriodEnum.hebdomadaire)} />
                                Hebdomadaire
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    defaultChecked={period.periodEnum === PeriodEnum.mensuelle}
                                    type="radio"
                                    name="radio1"
                                    onClick={() => handleClickPeriodEnum(PeriodEnum.mensuelle)} />
                                Mensuelle
                            </Label></FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    defaultChecked={period.periodEnum === PeriodEnum.annuelle}
                                    type="radio"
                                    name="radio1"
                                    onClick={() => handleClickPeriodEnum(PeriodEnum.annuelle)} />
                                Annuelle
                            </Label>
                        </FormGroup>
                    </FormGroup>
                </Col>

                {/* Paramètres de périodicité */}
                <Col>

                    {/* Quotidien */}
                    <Row style={{ marginLeft: '0' }}>
                        {period.periodEnum == PeriodEnum.quotidienne &&
                            <>
                                <p>Tous les</p>
                                <Input
                                    type='text'
                                    defaultValue={period.every}
                                    style={{ width: '50px', margin: '0 1em 0 1em' }}
                                    onChange={(e) => { handleValidateEvery(Number(e.target.value)) }}>
                                </Input>
                                <p>jours</p>
                                {printError()}
                            </>
                        }
                    </Row>

                    {/* Hebdomadaire */}
                    <Row style={{ display: 'block', marginLeft: '1em' }}>
                        {period.periodEnum == PeriodEnum.hebdomadaire &&
                            <>
                                <Row>
                                    <p>Toutes les</p>
                                    <Input
                                        type='text'
                                        defaultValue={period.every}
                                        style={{ width: '50px', margin: '0 1em 0 1em' }}
                                        onChange={(e) => { handleValidateEvery(Number(e.target.value)) }}>
                                    </Input>
                                    <p>semaine(s) le:</p>
                                    {printError()}
                                </Row>
                                <Row style={{ marginLeft: '1em' }}>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('lundi')}
                                            type='checkbox'
                                            name="checkLundi"
                                            onChange={() => { handleClickDay('lundi') }}
                                        /> Lundi
                                    </Col>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('mardi')}
                                            type='checkbox'
                                            name="checkMardi"
                                            onChange={() => { handleClickDay('mardi') }}
                                        /> Mardi
                                    </Col>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('mercredi')}
                                            type='checkbox'
                                            name="checkMercredi"
                                            onChange={() => { handleClickDay('mercredi') }}
                                        /> Mercredi
                                    </Col>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('jeudi')}
                                            type='checkbox'
                                            name="checkJeudi"
                                            onChange={() => { handleClickDay('jeudi') }}
                                        /> Jeudi
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: '1em' }}>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('vendredi')}
                                            type='checkbox'
                                            name="checkVendredi"
                                            onChange={() => { handleClickDay('vendredi') }}
                                        /> Vendredi
                                    </Col>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('samedi')}
                                            type='checkbox'
                                            name="checkSamedi"
                                            onChange={() => { handleClickDay('samedi') }}
                                        /> Samedi
                                    </Col>
                                    <Col>
                                        <Input
                                            defaultChecked={period.day?.includes('dimanche')}
                                            type='checkbox'
                                            name="checkDimanche"
                                            onChange={() => { handleClickDay('dimanche') }}
                                        /> Dimanche
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </>
                        }
                    </Row>

                    {/* Mensuelle */}
                    <Row style={{ marginLeft: '1em' }}>
                        {period.periodEnum == PeriodEnum.mensuelle &&
                            <>
                                <Row>
                                    <FormGroup tag="fieldset">
                                        <FormGroup check>
                                            <Row style={{ marginLeft: '0' }}>
                                                <Label check>
                                                    <Input
                                                        defaultChecked={numericMode}
                                                        type="radio"
                                                        name="radio2"
                                                        onClick={() => {
                                                            const newPeriod: PeriodType = {
                                                                periodEnum: PeriodEnum.mensuelle,
                                                                every: period.every,
                                                                rank: '1'
                                                            }
                                                            onPeriodModified(newPeriod)
                                                            setNumericMode(true)
                                                        }}
                                                    />
                                                    <p>Le: </p>
                                                </Label>
                                                <Input
                                                    type='select'
                                                    className='select-input'
                                                    value={numericMode ? period.rank : '1'}
                                                    style={{ height: '35px', width: '50px', margin: '0 1em 0 1em' }}
                                                    onChange={(e) => handleClickRank(e.target.value)}
                                                >
                                                    {Array.from(Array(31), (_, i) => i + 1).map(num => {
                                                        return (
                                                            <option
                                                                value={num}
                                                                key={`num${num * Date.now()}`}
                                                                disabled={!numericMode}
                                                            >
                                                                {num}
                                                            </option>
                                                        )
                                                    })}
                                                </Input>
                                                <p>tous les  </p>
                                                <Input
                                                    disabled={!numericMode}
                                                    type='text'
                                                    value={numericMode ? period.every : 1}
                                                    style={{ width: '50px', margin: '0 1em 0 1em' }}
                                                    onChange={(e) => handleValidateEvery(Number(e.target.value))} />
                                                <p>mois </p>
                                                {printError()}
                                            </Row>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Row style={{ marginLeft: '0' }}>
                                                <Label check>
                                                    <Input
                                                        defaultChecked={!numericMode}
                                                        type="radio"
                                                        name="radio2"
                                                        onClick={() => {
                                                            const newPeriod: PeriodType = {
                                                                periodEnum: PeriodEnum.mensuelle,
                                                                every: period.every,
                                                                rank: 'Premier',
                                                                day: ['Lundi'],
                                                                month: '1'
                                                            }
                                                            onPeriodModified(newPeriod)
                                                            setNumericMode(false)
                                                        }} />
                                                    Le
                                                </Label>
                                                <FormGroup >
                                                    <Input
                                                        disabled={numericMode}
                                                        value={ranks.indexOf(period.rank ? period.rank : ranks[0])}
                                                        type='select'
                                                        className='select-input'
                                                        onChange={(e) => { handleClickRank(ranks[parseInt(e.target.value)]) }}
                                                        style={{ height: '35px', marginLeft: '1em' }}>
                                                        {ranks.map((f, index) =>
                                                            <option
                                                                value={index}
                                                                key={index}>
                                                                {f}
                                                            </option>)}
                                                    </Input>
                                                    <Input
                                                        value={daysOfTheWeek.indexOf(period.day ? period.day[0] : 'Lundi')}
                                                        disabled={numericMode}
                                                        type='select'
                                                        className='select-input'
                                                        style={{ height: '35px', marginLeft: '1em' }}
                                                        onChange={(e) => { handleClickDay(daysOfTheWeek[Number(e.target.value)], true) }}>
                                                        {daysOfTheWeek.map((day, index) =>
                                                            <option
                                                                value={index}
                                                                key={index}>
                                                                {day}
                                                            </option>)}
                                                    </Input>
                                                </FormGroup>
                                                <p style={{ marginLeft: '1em' }}>tous les </p>
                                                <Input
                                                    disabled={numericMode}
                                                    type='text'
                                                    value={!numericMode ? period.every : 1}
                                                    style={{ width: '50px', margin: '0 1em 0 1em' }}
                                                    onChange={(e) => { handleValidateEvery(Number(e.target.value), false) }} />
                                                <p>mois </p>
                                                {printError(1)}
                                            </Row>
                                        </FormGroup>
                                    </FormGroup>
                                </Row>
                            </>
                        }
                    </Row>

                    {/* Annuelle */}
                    <Row style={{ marginLeft: '1em' }}>
                        {period.periodEnum == PeriodEnum.annuelle &&
                            <>
                                <Row style={{ marginLeft: '0' }}>
                                    <p>Tous les</p>
                                    <Input
                                        type='text'
                                        defaultValue={period.every}
                                        onChange={(e) => { handleValidateEvery(Number(e.target.value)) }}
                                        style={{ width: '50px', margin: '0 1em 0 1em' }}>
                                    </Input>
                                    <p>an(s)</p>
                                    {printError()}
                                </Row>
                                <FormGroup tag="fieldset">
                                    <FormGroup check>
                                        <Row style={{ marginLeft: '0' }}>
                                            <Label check>
                                                <Input
                                                    defaultChecked={numericMode}
                                                    type="radio"
                                                    name="radio3"
                                                    onClick={() => {
                                                        const newPeriod: PeriodType = {
                                                            periodEnum: PeriodEnum.annuelle,
                                                            every: period.every,
                                                            rank: '1',
                                                            month: 'Janvier'
                                                        }
                                                        onPeriodModified(newPeriod)
                                                        setNumericMode(true)
                                                    }}
                                                />
                                                <p>Le: </p>
                                            </Label>
                                            <Input
                                                type='select'
                                                className='select-input'
                                                disabled={!numericMode}
                                                value={numericMode ? period.rank : '1'}
                                                onChange={(e) => handleClickRank(e.target.value)}
                                                style={{ height: '35px', width: '50px', margin: '0 1em 0 1em' }}
                                            >
                                                {Array.from(Array(31), (_, i) => i + 1).map(num => {
                                                    return (
                                                        <option
                                                            value={num}
                                                            key={`num${num * Date.now()}`}
                                                            disabled={!numericMode}
                                                        >
                                                            {num}
                                                        </option>
                                                    )
                                                })}
                                            </Input>
                                            <p>tous les  </p>
                                            <Input
                                                disabled={!numericMode}
                                                value={monthes.indexOf(period.month ? period.month : monthes[0])}
                                                type='select'
                                                onChange={(e) => handleClickMonth(monthes[Number(e.target.value)])}
                                                className='select-input'
                                                style={{ height: '35px', marginLeft: '1em' }}>
                                                {monthes.map((m, index) =>
                                                    <option
                                                        value={index}
                                                        key={index}>
                                                        {m}
                                                    </option>)}
                                            </Input>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Row style={{ marginLeft: '0' }}>
                                            <Label check>
                                                <Input
                                                    defaultChecked={!numericMode}
                                                    type="radio"
                                                    name="radio3"
                                                    onClick={() => {
                                                        const newPeriod: PeriodType = {
                                                            periodEnum: PeriodEnum.annuelle,
                                                            every: period.every,
                                                            rank: 'Premier',
                                                            day: ['Lundi'],
                                                            everyMonth: 1
                                                        }
                                                        onPeriodModified(newPeriod)
                                                        setNumericMode(false)
                                                    }} />
                                                Le
                                            </Label>
                                            <FormGroup >
                                                <Input
                                                    disabled={numericMode}
                                                    value={ranks.indexOf(period.rank ? period.rank : ranks[0])}
                                                    type='select'
                                                    className='select-input'
                                                    onChange={(e) => handleClickRank(ranks[parseInt(e.target.value)])}
                                                    style={{ height: '35px', marginLeft: '1em' }}>
                                                    {ranks.map((f, index) =>
                                                        <option
                                                            value={index}
                                                            key={index}>
                                                            {f}
                                                        </option>)}
                                                </Input>
                                                <Input
                                                    value={daysOfTheWeek.indexOf(period.day ? period.day[0] : 'Lundi')}
                                                    disabled={numericMode}
                                                    type='select'
                                                    className='select-input'
                                                    onChange={(e) => { handleClickDay(daysOfTheWeek[Number(e.target.value)], true) }}
                                                    style={{ height: '35px', marginLeft: '1em' }}>
                                                    {daysOfTheWeek.map((day, index) =>
                                                        <option
                                                            value={index}
                                                            key={index}>
                                                            {day}
                                                        </option>)}
                                                </Input>
                                            </FormGroup>
                                            <p style={{ marginLeft: '1em' }}>de </p>
                                            <Input
                                                disabled={numericMode}
                                                value={monthes.indexOf(period.month ? period.month : monthes[0])}
                                                type='select'
                                                onChange={(e) => handleClickMonth(monthes[Number(e.target.value)])}
                                                className='select-input'
                                                style={{ height: '35px', marginLeft: '1em' }}>
                                                {monthes.map((m, index) =>
                                                    <option
                                                        value={index}
                                                        key={index}>
                                                        {m}
                                                    </option>)}
                                            </Input>
                                            {printError(1)}
                                        </Row>
                                    </FormGroup>
                                </FormGroup>
                            </>
                        }
                    </Row>
                </Col>
            </Row >
        </>
    );
}

export { Period };