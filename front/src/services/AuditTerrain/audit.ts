import RequestService from "../request";
import {Audit, AuditMap} from "../../models/AuditTerrain/audit";
import moment from "moment";

const GetAuditByServiceAndDate = async (serviceId: number, date: Date | undefined) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`audits/${serviceId}/${moment(date).format('YYYY-MM-DD')}`);
    return res?.data.map((audit: Audit) => ({
        ...audit,
        createdAt: new Date(audit.createdAt),
        updatedAt: new Date(audit.updatedAt)
    }));
}

const AddAudit = async (audit: Audit) => {
    let req = new RequestService();
    let user = JSON.parse( localStorage.getItem('user')! );

    const res = await req.fetchEndpoint('audits', 'POST', {...audit, user});
    const newAudit = res?.data.newAudit;
    return {
        ...newAudit,
        updatedAt: new Date(newAudit.updatedAt),
        createdAt: new Date(newAudit.createdAt)
    };
}

const EditAudit = async (id: number, audit: Audit) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audits/${id}`, 'PUT', audit);
    return res?.data.updatedAudit;
}

const DeleteAudit = async (id: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`audits/${id}`, 'DELETE');
    return res?.data
}

const GetAuditMap = async () => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('audit-map');
    if( res?.data?.length > 0 ) {
        return res?.data[0];
    }
    return undefined;
}

const AddAuditMap = async (auditMap: AuditMap) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint('audit-map', 'POST', auditMap);
    const newAuditMap = res?.data.newAuditMap;
    return newAuditMap;
}

const EditAuditMap = async (id: number, auditMap: AuditMap) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-map/${id}`, 'PUT', auditMap);
    return res?.data.updatedAuditMap;
}

const GetParetoDiagram = async (serviceId:number, year:number) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-pareto/${serviceId}/${year}`);
    return res?.data;
}

const GetNokByMonth = async (date: Date) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-stats/NOKByMonth/${date.toString()}`);
    return res?.data;
}

const GetNokByYear = async (date: Date) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-stats/NOKByYear/${date.toString()}`);
    return res?.data;
}

const GetNokByZone = async (serviceId:number, date: Date) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-stats/NOKByZone/${[serviceId, date.toString()]}`);
    return res?.data;
}

const GetAnnuelByZone = async (date: Date) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-stats/AnnuelByZone/${date.toString()}`);
    return res?.data
}

const GetAnnuelByStatus = async (serviceId:number, date: Date) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`audit-Stats/AnnuelByStatus/${[serviceId, date.toString()]}`);
    return res?.data;
}

export {
    GetAuditByServiceAndDate,
    AddAudit,
    EditAudit,
    DeleteAudit,
    GetAuditMap,
    AddAuditMap,
    EditAuditMap,
    GetParetoDiagram,
    GetNokByMonth,
    GetNokByYear,
    GetNokByZone,
    GetAnnuelByZone,
    GetAnnuelByStatus
}
