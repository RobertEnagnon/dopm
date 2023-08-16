import { Responsible } from "../responsible";
import { Zone } from "../zone";

type Notification = {
  id: number,
  responsable: Responsible,
  responsable_id: number,
  zone: Zone,
  zone_id: number,
  isSubscribed: number
}

export type {
  Notification
}
