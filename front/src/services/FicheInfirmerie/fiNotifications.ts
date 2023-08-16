import RequestService from "../request";

const GetFSNotificationsPerZone = async (zoneId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`finotifications?zone=${zoneId}`);
  return res?.data.map((finotifications: any) => ({
    ...finotifications,
    responsableId: finotifications.responsable_id,
    zoneId: finotifications.zone_id,
  }));
}

const UpdateFSNotification = async (zone: number, responsable: number, isSubscribed: boolean) => {
  let req = new RequestService();
  const response = await req.fetchEndpoint("finotifications", "POST", {
    zone,
    responsable,
    isSubscribed,
  });
  return response?.data
}

export {
  GetFSNotificationsPerZone,
  UpdateFSNotification
}
