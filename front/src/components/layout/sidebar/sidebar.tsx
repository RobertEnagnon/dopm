import { useDopm } from "../../context/dopm.context";
import React, { useEffect, useState } from 'react';
import initialRoutes from "../../routes/routes";
import SidebarCategory from "./sidebar-category";
import SidebarItem from "./sidebar-item";
import { useUser } from "../../context/user.context";
import { GetBranches } from "../../../services/Top5/branch";
import { Branch } from "../../../models/Top5/branch";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { permissionsList } from "../../../models/Right/permission";
import "./sidebar.scss";
import {useDashboard} from "../../../hooks/dashboard";
import defaultImgPreview from "../../../assets/img/avatars/avatar.webp";
import { useAsBoard } from "../../../hooks/Assignation/asboard";

type Routes = {
    path: string,
    name: string,
    icon?: IconDefinition,
    children?: Array<Routes>,
    header?: boolean,
    badgeColor?: string,
    badgeText?: string,
    open?: boolean,
    containsHome?: boolean,
    isDashboard?: boolean,
    isTop5?: boolean,
    isAss?: boolean
}

const initOpenRoutes = (routes: Routes[]) => {
    const pathName = location.pathname;
    let _routes = {};

    routes.forEach((route, index) => {
        const isActive = pathName.indexOf(route.path) === 0 || (pathName.includes('dashboard') && route.isDashboard) || pathName.includes('Assignation') && route.isAss;
        const isOpen = !!route.open;
        const isHome = !!route.isDashboard && pathName === "/";

        _routes = Object.assign({}, _routes, {
            [index]: isActive || isOpen || isHome,
        });
    });
    return _routes;
}

const Sidebar = () => {
    const routes = initialRoutes;
    const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
    const dopm = useDopm()
    const userContext = useUser();
    const { dashboards, isDashboardsFetched } = useDashboard();
    const { asBoards } = useAsBoard();
    const currentPermissions = {
        ajoutFicheSecurite: userContext.checkAccess(permissionsList.ajoutFicheSecurite),
        lectureFicheSecurite: userContext.checkAccess(permissionsList.lectureFicheSecurite),
        traitementFicheSecurite: userContext.checkAccess(permissionsList.traitementFicheSecurite),
        lectureStatistiquesFicheSecurite: userContext.checkAccess(permissionsList.lectureStatistiquesFicheSecurite),
        parametrageFicheSecurite: userContext.checkAccess(permissionsList.parametrageFicheSecurite),
        realisationAuditTerrain: userContext.checkAccess(permissionsList.realisationAuditTerrain),
        parametrageAuditTerrain: userContext.checkAccess(permissionsList.parametrageAuditTerrain),
    }

    const [openRoutes, setOpenRoutes] = useState<any>([])
    const [sidebarRoutes, setSidebarRoutes] = useState<any>([]);
    const [top5Childrens, setTop5Childrens] = useState<any[]>([]);
    const [dashboardChildrens, setDashboardChildrens] = useState<any[]>([]);
    const [assignationChildrens, setAssignationChildrens] = useState<any[]>([]);
    const [nbMenuFetched, setNbMenuFetched] = useState<number>(0);

    const currentUser = userContext.currentUser

    const getBranchesRoutes = async (DBBranches: Branch[]) => {
      let children: Array<any> = [];

      if (!DBBranches || DBBranches.length === 0) {
        return children
      }

      await Promise.all(DBBranches.map(async (b: Branch) => {
        const read = userContext.checkAccess(permissionsList.lectureGraphique, b.id)
          || userContext.checkAccess(permissionsList.ajoutDonneesCategorie, b.id)
        const addData = userContext.checkAccess(permissionsList.ajoutDonneesCategorie, b.id)
        const addHisto = userContext.checkAccess(permissionsList.ajoutDonneesCategorie, b.id)
        const parameter = userContext.checkAccess(permissionsList.parametrageTop5, b.id)
        if (read || addData || addHisto || parameter) {
          const path = read
            ? `/Top5/${b.name}`
            : addData
              ? `/Top5/dataform/${b.name}`
              : addHisto
                ? `/Top5/histoform/${b.name}`
                : `/Top5/settings/${b.name}`
          children.push(
            { path: path, name: b.name }
          )
        }
      }))

      return children
    }

    const getDashboardRoutes = async () => {
      let children: any[] = [];

      const allowedDashboards = dashboards.filter(dashboard => userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
          || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))

      if (!allowedDashboards.length) {
        return children
      }

      return allowedDashboards.map(d => {
        return {
          name: d.name,
          path: `/dashboard/${d.id}`
        }
      })
    }

    const getAssignationRoutes = async () => {
      return asBoards.map(asb => {
        return {
          name: asb.name,
          path: `/Assignation/${asb.id}/PDCA`
        }
      })
    }

    useEffect(() => {
        if (nbMenuFetched === 0 && isDashboardsFetched && userContext.isConnected) {
          getDashboardRoutes().then(dashboards => {
            setDashboardChildrens(dashboards);
            setNbMenuFetched(nbMenuFetched + 1);
          });
        }
        if (nbMenuFetched === 1 && userContext.isConnected) {
            GetBranches()
                .then(async (DBBranches) => {
                    setTop5Childrens(await getBranchesRoutes(DBBranches));
                    setNbMenuFetched(nbMenuFetched + 1);
                })
        }
        if (nbMenuFetched === 2) {
          getAssignationRoutes()
            .then(asBoards => {
              setAssignationChildrens(asBoards);
              setNbMenuFetched(nbMenuFetched + 1);
            })
        }
        if (nbMenuFetched === 3) {
          setSidebarRoutes(routes.map(route => {
            if (route.isDashboard) {
              if (dashboardChildrens.length === 0) {
                route.path = '/dashboard/undefined'
                route.name = 'DashBoard'
                route.children = undefined
              } else if (dashboardChildrens.length === 1) {
                route.name = dashboardChildrens[0].name
                route.path = dashboardChildrens[0].path
                route.children = undefined
              } else {
                route.name = 'DashBoard'
                route.path = undefined
                route.children = dashboardChildrens
              }
            }

            if (route.isTop5) {
              route.children = top5Childrens.length ? top5Childrens : undefined
            }

            if (route.isAss) {
              route.children = assignationChildrens.length ? assignationChildrens : undefined
            }
            return route
          }));
          setOpenRoutes(initOpenRoutes(sidebarRoutes));
        }
    }, [userContext.isConnected, dashboards, isDashboardsFetched, nbMenuFetched, dashboardChildrens, top5Childrens])

    const toggle = (index: any) => {
        Object.keys(openRoutes).forEach(
            (item: string) =>
                openRoutes[index] ||
                setOpenRoutes((openRoutes: any) =>
                    Object.assign({}, openRoutes, { [item]: false })
                )
        );

        setOpenRoutes((openRoutes: any) =>
            Object.assign({}, openRoutes, { [index]: !openRoutes[index] })
        );
        console.log(index, openRoutes);
    }
    const accessFS = (
        currentPermissions?.ajoutFicheSecurite
        || currentPermissions?.lectureFicheSecurite
        || currentPermissions?.traitementFicheSecurite
        || currentPermissions?.lectureStatistiquesFicheSecurite
        || currentPermissions?.parametrageFicheSecurite
    )

    const pathFS = (
        currentPermissions?.ajoutFicheSecurite ? '/FicheSecurite/creation'
            : currentPermissions?.lectureFicheSecurite || currentPermissions?.traitementFicheSecurite ? '/FicheSecurite/consultation'
                : currentPermissions?.lectureStatistiquesFicheSecurite ? '/FicheSecurite/statistiques'
                    : currentPermissions?.parametrageFicheSecurite ? '/FicheSecurite/parametres' : ''
    )

    const accessAT = currentPermissions?.realisationAuditTerrain || currentPermissions?.parametrageAuditTerrain;
    const pathAT = currentPermissions?.realisationAuditTerrain ? '/AuditTerrain/Audit' : '/AuditTerrain/Parametres'

    const avatarUrl = `${PUBLIC_URL}${currentUser.url}`

    return (
        <nav className={`sidebar ${dopm.isSidebarOpen ? 'toggled' : ''} ${dopm.isSidebarOnRight ? 'sidebar-right' : ''}`}>
            <div className="sidebar-content">
                <a className={`sidebar-brand ${dopm.isSidebarOnRight ? 'text-right' : ''}`} href="/">
                    <img
                        src={require("../../../assets/img/dopm/SodigitaleHorizontalev2.webp")}
                        alt="logo"
                        className="logo"
                    />
                </a>

                <div className="sidebar-user">
                    <img
                        src={avatarUrl}
                        className="img-fluid rounded-circle mb-2"
                        alt="avatar"
                        onError={(event: any) => event.target.src = defaultImgPreview}
                    />
                    <div className="font-weight-bold">
                        {currentUser.firstname} {currentUser.lastname}
                    </div>
                    <small>{currentUser.function}</small>
                </div>
                <ul className="sidebar-nav">
                    {sidebarRoutes.map((route: Routes, i: number) => {
                        return (
                            <React.Fragment key={i}>
                                {route.header ?
                                    <li className="sidebar-header">{route.name}</li> : null
                                }

                                {route.children ?
                                    <SidebarCategory
                                        name={route.name}
                                        badgeColor={route.badgeColor}
                                        badgeText={route.badgeText}
                                        icon={route.icon}
                                        to={route.path}
                                        isOpen={openRoutes[i]}
                                        onClick={() => toggle(i)}
                                    >
                                        {route.children.map((childRoute, j) => {
                                            return (
                                                <SidebarItem
                                                    key={j}
                                                    name={childRoute.name}
                                                    to={childRoute.path}
                                                    badgeColor={childRoute.badgeColor}
                                                    badgeText={childRoute.badgeText}
                                                />
                                            )
                                        })}
                                    </SidebarCategory>
                                    :
                                    <SidebarItem
                                        name={route.name}
                                        icon={route.icon}
                                        to={
                                            route.name === "Fiche Sécurité"
                                                ? pathFS
                                                : route.name === "Audit Terrain"
                                                    ? pathAT
                                                    : route.path
                                        }
                                        badgeColor={route.badgeColor}
                                        badgeText={route.badgeText}
                                        className={
                                          route.name === "Fiche Sécurité" && !accessFS
                                            ? "disabled"
                                            : route.name === "Audit Terrain" && !accessAT
                                                ? "disabled"
                                                : route.name === "Top 5"
                                                    ? "disabled"
                                                    : route.path === "/" || route.path === "/dashboard/undefined" || route.path === "dashboard/undefined"
                                                      ? "disabled"
                                                      : ""
                                        }
                                    />
                                }
                            </React.Fragment>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
}

export default Sidebar;
