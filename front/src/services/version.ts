import RequestService from "./request";
import type { Version } from '../models/version'

const version = "version"

const DeleteVersion = async (id: number) =>
{
    let req = new RequestService();
    return await req.fetchEndpoint(`versions/${id}`, 'DELETE');
}

const UpdateVersion = async (version: Version) =>
{
    let req = new RequestService();
    return await req.fetchEndpoint(`versions/${version.id}`, 'PUT', version)
}

const PostVersion = async (version: Version) =>
{
    let req = new RequestService();
    return await req.fetchEndpoint("versions", "POST", version)
}

const GetAllVersion = async() =>
{
    let req = new RequestService();
    return await req.fetchEndpoint("versions", "GET");
}


const GetLastVersion = async() =>
{
    let req = new RequestService();
    const res = await req.fetchEndpoint("versions-last", "GET");
    return res;
}

const GetCurrentVersion = () : string | null =>{
    return localStorage.getItem(version);
}

const SetCurrentVersion = (versionName: string) => {
    localStorage.setItem(version, versionName)
}

const versionServices = {
    PostVersion,
    GetAllVersion,
    GetLastVersion,
    GetCurrentVersion,
    SetCurrentVersion,
    DeleteVersion,
    UpdateVersion
}

export default versionServices 