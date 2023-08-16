import {useEffect, useState} from "react";
import {Zone} from "../models/zone";
import {AddZone, DeleteZone, GetZones, UpdateZone} from "../services/zone";
import {AddSubZone, DeleteSubZone, GetSubZones, UpdateSubZone} from "../services/subzone";
import {Subzone} from "../models/subzone";

export const useZone = () => {
  const [ zones, setZones ] = useState<Array<Zone>>([]);
  const [ subzones, setSubzones ] = useState<Array<Zone>>([]);

  useEffect(() => {
    let isMounted = true;
      GetZones()
        .then((zones) => {
          if (isMounted) {
            setZones(zones);
          }
        });
    return () => {
      isMounted = false
    }
  }, []);

  const fetchSubzones = async (zoneId: number) => {
    const subzones = await GetSubZones(zoneId);
    setSubzones(subzones);
  }

  const addZone = async (zone: Zone) => {
    const response = await AddZone(zone);
    if (response.newZone) {
      setZones(zones.concat({ ...response.newZone, createdAt: new Date(response.newZone.createdAt), updatedAt: new Date(response.newZone.updatedAt), subzones: [] }))
    }
    return response;
  }

  const updateZone = async (id: number, zone: Zone) => {
    const res = await UpdateZone(id, zone);
    if (res.message) {
      setZones(zones.map(z => {
        if (z.id === id) {
          return { ...z, ...zone };
        }
        return z;
      }));
    }
    return res;
  }

  const deleteZone = async (id: number) => {
    const res = await DeleteZone(id);
    if (res.message) {
      setZones(zones.filter(zone => zone.id !== id));
    }
    return res;
  }

  const addSubZone = async (subzone: Subzone) => {
    const response = await AddSubZone(subzone);
    if (response.subZone) {
      setZones(zones.map(zone => {
        if (zone.id === response.subZone.zone_id) {
          zone.subzones = zone.subzones?.concat({ ...response.subZone, zoneId: response.subZone.zone_id });
        }
        return zone;
      }))
    }
    return response;
  }

  const updateSubZone = async (id: number, subzone: Subzone) => {
    const res = await UpdateSubZone(id, subzone);
    if (res.message) {
      setZones(zones.map(z => {
        if (z.id === subzone.zoneId) {
          z.subzones = z.subzones?.map(sz => {
            if (sz.id === id) {
              return { ...sz, ...subzone };
            }
            return sz;
          })
        }
        return z;
      }));
    }
    return res;
  }

  const deleteSubZone = async (id: number, zoneId: number) => {
    const res = await DeleteSubZone(id);
    if (res.message) {
      setZones(zones.map(zone => {
        if (zone.id === zoneId) {
          zone.subzones = zone.subzones?.filter(subzone => subzone.id !== id);
        }
        return zone;
      }));
    }
    return res;
  }

  return {
    zones,
    subzones,
    fetchSubzones,
    addZone,
    updateZone,
    deleteZone,
    addSubZone,
    updateSubZone,
    deleteSubZone
  };
}