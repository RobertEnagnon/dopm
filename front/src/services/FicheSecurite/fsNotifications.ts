import RequestService from "../request";

const GetFSNotificationsPerZone = async (zoneId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`fsnotifications?zone=${zoneId}`);
  return res?.data.map((fsnotifications: any) => ({
    ...fsnotifications,
    responsableId: fsnotifications.responsable_id,
    zoneId: fsnotifications.zone_id,
  }));
}

const UpdateFSNotification = async (zone: number, responsable: number, isSubscribed: boolean) => {
  let req = new RequestService();
  const response = await req.fetchEndpoint("fsnotifications", "POST", {
    zone,
    responsable,
    isSubscribed,
  });
  return response?.data;
}

export {
  GetFSNotificationsPerZone,
  UpdateFSNotification
}
