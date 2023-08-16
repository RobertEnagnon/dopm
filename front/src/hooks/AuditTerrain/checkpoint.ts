import {useEffect, useState} from "react";
import {Checkpoint} from "../../models/AuditTerrain/checkpoint";
import {
    AddCheckpoint,
    DeleteCheckpoint,
    GetCheckpoints,
    UpdateCheckpoint
} from "../../services/AuditTerrain/checkpoint";
import {Service} from "../../models/service";
import {useService} from "../service";


export const useCheckpoint = () => {
    const { services } = useService();

    const [ checkpoints, setCheckpoints ] = useState<Array<Checkpoint>>([]);
    const [ service, setService ] = useState<Service>();
    const [ availableServices, setAvailableServices ] = useState<Array<Service>>([]);

    useEffect(() => {
        GetCheckpoints()
            .then(checks => {
                setCheckpoints(checks);
            });
    }, [])

    useEffect(() => {
        if( service ) {
            GetCheckpoints()
                .then(checks => {
                    let tmpServices: Array<Service> = [];

                    /* Checkpoints of selectionned service */
                    const checksToDisplay = checks.filter((ch:Checkpoint) =>
                        ch.services?.filter(s => s.id === service.id ) &&
                        ch.services?.filter(s => s.id === service.id ).length > 0);

                    /* Search other services with at least 1 commune checkpoint */
                    checksToDisplay.forEach((ch: Checkpoint) => {
                        let tmp = ch.services?.filter(s => s.id !== service.id)
                        if( tmp && tmp.length > 0 ) {
                            tmp.forEach(t => {
                                if( tmpServices.filter(f => f.id === t.id ).length == 0 ) {
                                    tmpServices.push(t);
                                }
                            })
                        }
                    })

                    setCheckpoints(checksToDisplay);
                    setAvailableServices(tmpServices);
                });
        }
    }, [ service, services ])

    const addCheckpoint = async (checkpoint: Checkpoint) => {
        const newCheckpoint = await AddCheckpoint(checkpoint);
        setCheckpoints(checkpoints.concat(newCheckpoint));
        return newCheckpoint;
    }

    const updateCheckpoint = async (id: number, checkpoint: Checkpoint) => {
        const res = await UpdateCheckpoint(id, checkpoint);
        setCheckpoints(checkpoints.map((check) => {
            if( check.id === id ) {
                return {...check, ...res?.data?.checkpoint};
            }
            return check;
        }))
        return checkpoint;
    }

    const deleteCheckpoint = async (id: number) => {
        const res = await DeleteCheckpoint(id);
        if( res.message ) {
            setCheckpoints(checkpoints.filter(checkpoint => checkpoint.id !== id));
        }
        return res;
    }

    return {
        checkpoints,
        addCheckpoint,
        updateCheckpoint,
        deleteCheckpoint,
        setService,
        service,
        availableServices
    }
}
