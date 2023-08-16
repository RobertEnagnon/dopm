import { Comment, Historical } from "../../models/Top5/historical";
import RequestService from "../request";
import { CalculHisto, Indicator } from "../../models/Top5/indicator";

const GetHistoricalsByIndicator = async (indicatorId: number, year: number | undefined = undefined) => {
    let historicals: Array<Historical> = [];
    let requestLink: string = '';
    let req = new RequestService()

    if (year) {
        requestLink = `historicals/?indicatorId=${indicatorId}&year=${year}`;
    } else {
        requestLink = `historicals/?indicatorId=${indicatorId}`;
    }

    const res = await req.fetchEndpoint(requestLink);

    res?.data?.forEach((data: any) => {
        historicals.push({
            id: data.id,
            month: data.month,
            year: data.year,
            data: data.data,
            target: data.target,
            indicatorId: indicatorId
        })
    })
    historicals.sort((a: Historical, b: Historical) => {
        if (a.month < b.month) {
            return -1;
        } else if (a.month > b.month) {
            return 1;
        }
        return 0;
    })

    return historicals;
}

const GetHistoByIndicators = async (indicators: Array<Indicator>, year: number | undefined = undefined) => {
    let histos: Array<Historical> = [];
    let req = new RequestService();

    for (const indicator of indicators) {
        let requestLink = '';
        if (year) {
            requestLink = `historicals/?indicatorId=${indicator.id}&year=${year}`;
        } else {
            requestLink = `historicals/?indicatorId=${indicator.id}`;
        }

        const res = await req.fetchEndpoint(requestLink);
        res?.data?.forEach((data: any) => {
            histos.push({
                id: data.id,
                month: data.month,
                year: data.year,
                data: data.data,
                target: data.target,
                comment: data.comment,
                indicatorId: indicator.id
            })
            histos.sort((a: Historical, b: Historical) => {
                if (a.month < b.month) {
                    return -1;
                } else if (a.month > b.month) {
                    return 1;
                }
                return 0;
            })
        })
    }

    return histos
}

const CreateHisto = async (histo: Historical) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`historicals`, 'POST', histo)
    return res;
}

const UpdateHisto = async (histo: Historical) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`historicals/${histo.id}`, 'PUT', histo)
    return res;
}
const CommentHisto = async (dataToSend: Comment, dataValue: { target: string, data: string }) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`historicals/comment/${dataToSend.id}`, 'POST', { ...dataToSend, ...dataValue })
    return res;
}

const DeleteHistoricalsByIndicator = async (indicator: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`historicals/deleteAll/${indicator}`, 'DELETE')
    return res;
}


const GetAllIndicatorsCalculHistorical = async () => {
    let calculHistorical: Array<CalculHisto> = [];
    let req = new RequestService();
    const res = await req.fetchEndpoint(
        `historicals/calculHistorical`
    )
    res?.data.forEach((calcul: CalculHisto) => calculHistorical.push(calcul))
    return calculHistorical;
}


const UpdateCalculHistorical = async (indicatorId: number, date: string) => {
    let req = new RequestService();
    await req.fetchEndpoint(
        `historicals/calculHistorical/${indicatorId}`,
        "PUT",
        {
            date
        }
    );
}

export {
    GetHistoricalsByIndicator,
    GetHistoByIndicators,
    CreateHisto,
    UpdateHisto,
    CommentHisto,
    DeleteHistoricalsByIndicator,
    GetAllIndicatorsCalculHistorical,
    UpdateCalculHistorical
}