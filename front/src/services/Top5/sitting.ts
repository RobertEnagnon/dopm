import RequestService from "../request";

type S = {
    alterateDate: boolean,
    userId: number
}

const SaveAlterateDate = async (data: S) => {
    let req = new RequestService()
    return await req.fetchEndpoint("setting/altdate", "POST", data)
}

export {
    SaveAlterateDate
}