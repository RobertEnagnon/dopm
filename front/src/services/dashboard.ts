import RequestService from "./request";
import { Dashboard } from "../models/dashboard";

const GetDashboards = async () => {
    let dashboards: Array<Dashboard> = []

    let req = new RequestService();
    const res = await req.fetchEndpoint( 'dashboards' )
    if(res?.data && res.data.length > 0) {
        res.data.forEach((dashboard: Dashboard) => {
            dashboards.push({
                id: dashboard.id,
                name: dashboard.name,
                order: dashboard.order,
                createdAt: new Date(dashboard.createdAt)
            })
        })
    }

    return dashboards
}

const AddDashboard = async (dashboard: Dashboard) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('dashboards', 'POST', dashboard);
    return res?.data;
}

const UpdateDashboard = async (dashboard: Dashboard) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`dashboards/${dashboard.id}`, 'PUT', dashboard);
    return res?.data;
}

const DeleteDashboard = async (dashboardId: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`dashboards/${dashboardId}`, 'DELETE');
    return res?.data;
}

export {
    GetDashboards,
    AddDashboard,
    UpdateDashboard,
    DeleteDashboard
}