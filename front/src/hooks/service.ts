import {useEffect, useState} from "react";
import {AddService, DeleteService, GetServices, UpdateService} from "../services/Top5/service";
import {Service} from "../models/service";

export const useService = () => {
  const [ services, setServices ] = useState<Array<Service>>([]);

  useEffect(() => {
    let isMounted = true;
    GetServices()
      .then((services) => {
        if (isMounted) {
          setServices(services);
        }
      });
    return () => {
      isMounted = false
    }
  }, []);

  const addService = async (service: Service) => {
    const response = await AddService(service);
    if (response.newService) {
      setServices(services.concat({ ...response.newService, createdAt: new Date(response.newService.createdAt), updatedAt: new Date(response.newService.updatedAt) }))
    }
    return response;
  }

  const updateService = async (id: number, service: Service) => {
    const res = await UpdateService(id, service);
    if (res.message) {
      setServices(services.map(s => {
        if (s.id === id) {
          return { ...s, ...service };
        }
        return s;
      }));
    }
    return res;
  }

  const deleteService = async (id: number) => {
    const res = await DeleteService(id);
    if (res.message) {
      setServices(services.filter(service => service.id !== id));
    }
    return res;
  }

  return { services, addService, updateService, deleteService };
}