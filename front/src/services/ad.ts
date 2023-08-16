import { IConnectionAd } from "../models/ad"
import { UserWithToken } from "../models/user";
import RequestService from "./request";

const getUserInformations = async (): Promise<UserWithToken | undefined> => {
    let req = new RequestService();
    const res = await req.fetchEndpoint("ad/informations", "GET");
    return res?.data;
}


const createConnection = async (connection: IConnectionAd) => {

    let req = new RequestService();
    const res = await req.fetchEndpoint("ad", "POST", {
        login_url: connection.login_url,
        logout_url: connection.logout_url,
        certificat: connection.certificat,
        disable: connection.disable == "true"
    });
    return res?.data;
}

const getEnableConnection = async (): Promise<boolean | undefined> => {

    let req = new RequestService();
    const res = await req.fetchEndpoint("ad/enable", "GET");
    return res?.data;
}

const getConnection = async (): Promise<IConnectionAd[] | undefined> => {

    let req = new RequestService();
    const res = await req.fetchEndpoint("ad", "GET");
    return res?.data;
}

const modifiyConnection = async (connection: IConnectionAd) => {

    let req = new RequestService();
    const res = await req.fetchEndpoint(`ad/${connection.id}`, "PUT", {
        login_url: connection.login_url,
        logout_url: connection.logout_url,
        certificat: connection.certificat,
        disable: connection.disable == "true"
    });
    return res?.data;
}

const deleteConnection = async (id: number) => {

    let req = new RequestService();
    const res = await req.fetchEndpoint(`ad/${id}`, "DELETE");
    return res?.data;
}

export {
    getUserInformations,
    createConnection,
    getConnection,
    getEnableConnection,
    modifiyConnection,
    deleteConnection
}