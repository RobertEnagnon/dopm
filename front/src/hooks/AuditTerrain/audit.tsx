import {useEffect, useState} from "react";
import {Audit, AuditMap} from "../../models/AuditTerrain/audit";
import {
    AddAudit,
    AddAuditMap,
    DeleteAudit,
    EditAudit, EditAuditMap, GetAnnuelByStatus, GetAnnuelByZone,
    GetAuditByServiceAndDate, GetAuditMap, GetNokByMonth, GetNokByYear, GetNokByZone, GetParetoDiagram
} from "../../services/AuditTerrain/audit";
import {Service} from "../../models/service";

export const useAudit = ( service: Service|undefined, date: Date|undefined ) => {
    const [ audits, setAudits ] = useState<Array<Audit>>([]);
    const [ auditMap, setAuditMap ] = useState<AuditMap|undefined>(undefined);

    useEffect(() => {
        if( service ) {
            GetAuditByServiceAndDate(service.id, date)
                .then(audits => {
                    setAudits(audits)
                })
        }

        GetAuditMap()
            .then(res => {
                setAuditMap(res);
            })
    }, [ service, date ])

    const addAudit = async (audit: Audit) => {
        const newAudit = await AddAudit(audit);
        setAudits(audits?.concat(newAudit));
        return newAudit
    }

    const editAudit = async (id: number, audit: Audit) => {
        const editedAudit = await EditAudit(id, audit);
        setAudits(audits.map((aud) => {
            if (aud.id === id) {
                return {...aud, ...editedAudit};
            }
            return aud;
        }));
        return editedAudit
    }

    const deleteAudit = async (id: number) => {
        const res = await DeleteAudit(id);
        if( res.message ) {
            setAudits(audits.filter(audit => audit.id !== id));
        }
        return res;
    }

    const addMap = async (auditMap: AuditMap) => {
        const newMap = await AddAuditMap(auditMap);
        setAuditMap(newMap);
        return newMap;
    }

    const updateMap = async (id: number, auditMap: AuditMap) => {
        const editAuditMap = await EditAuditMap(id, auditMap);
        setAuditMap(editAuditMap);
        return editAuditMap;
    }

    const getParetoDiagram = async () => {
        let paretoDiagram;
        if( service?.id != undefined && date ) {
            paretoDiagram = await GetParetoDiagram(service.id, date.getFullYear());
        }
        return paretoDiagram;
    }

    const getNokByMonth = async () => {
        let data;
        if( date ) {
            data = await GetNokByMonth(date);
        }
        return data;
    }

    const getNokByYear = async () => {
        let data;
        if( date ) {
            data = await GetNokByYear(date);
        }
        return data;
    }

    const getNokByZone = async () => {
        let data;
        if( service?.id != undefined && date ) {
            data = await GetNokByZone(service.id, date);
        }
        return data
    }

    const getAnnuelByZone = async () => {
        let data;
        if( date ) {
            data = await GetAnnuelByZone(date);
        }
        return data;
    }

    const getAnnuelByStatus = async () => {
        let data;
        if( service?.id != undefined && date ) {
            data = await GetAnnuelByStatus(service.id, date);
        }
        return data;
    }

    return {
        audits,
        addAudit,
        editAudit,
        deleteAudit,
        auditMap,
        addMap,
        updateMap,
        getParetoDiagram,
        getNokByMonth,
        getNokByYear,
        getNokByZone,
        getAnnuelByZone,
        getAnnuelByStatus
    }
}
