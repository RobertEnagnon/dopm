import {useEffect, useState} from "react";
import {Dashboard} from "../models/dashboard";
import {AddDashboard, DeleteDashboard, GetDashboards, UpdateDashboard} from "../services/dashboard";
import {notify, NotifyActions} from "../utils/dopm.utils";

export const useDashboard = () => {
  const [ dashboards, setDashboards ] = useState<Array<Dashboard>>([]);
  const [ isDashboardsFetched, setIsDashboardsFetched ] = useState<boolean>(false);

  useEffect(() => {
    FetchDashboards()
  }, []);

  const FetchDashboards = async () => {
    const dashboards = await GetDashboards();
    setDashboards(dashboards);
    setIsDashboardsFetched(true);
    return dashboards;
  }

  const addDashboard = async (dashboard: Dashboard) => {
    const res = await AddDashboard(dashboard)
    if (res.newDashboard) {
      notify('Dashboard ajouté', NotifyActions.Successful)
      setDashboards(dashboards.concat(res.newDashboard))
    } else {
      notify('Problème ajout dashboard', NotifyActions.Error)
    }
  }

  const updateDashboard = async (dashboard: Dashboard) => {
    const res = await UpdateDashboard(dashboard)
    console.log(res)

    setDashboards(dashboards.map(d => {
      if (d.id === dashboard.id) {
        d = dashboard
      }
      return d
    }))
  }

  const deleteDashboard = async (dashboardId: number) => {
    const res = await DeleteDashboard(dashboardId)
    console.log(res)

    setDashboards(dashboards.filter(d => d.id !== dashboardId))
  }

  return { dashboards, FetchDashboards, addDashboard, updateDashboard, deleteDashboard, isDashboardsFetched };
}