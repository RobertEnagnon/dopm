import { Data } from "../../models/Top5/data";
import { Curve } from "../../models/Top5/curve";
import RequestService from "../request";

const GetDataByDateAndCurves = async (curves: Array<Curve>, date: Date) => {
    let datas: Array<Data> = [];
    let req = new RequestService()

    for (const curve of curves) {
        const res = await req.fetchEndpoint(`datas/?curveId=${curve.id}&date=${date.toLocaleDateString().substring(3)}`);
        res?.data?.forEach((data: any) => {
            datas.push({
                id: data.id,
                date: data.date,
                data: data.data,
                comment: data.comment,
                curve: curve
            })
        })
    }
    return datas;
}

const CreateData = async (data: Data) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`datas`, 'POST', data)
    return res;
}

const UpdateData = async (data: Data) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`datas/${data.id}`, 'PUT', data)
    return res;
}

export {
    GetDataByDateAndCurves,
    CreateData,
    UpdateData
}
