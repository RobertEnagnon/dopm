import {faBook, faChartColumn, faCheck, faHeart, faHome, faLightbulb, IconDefinition, faListCheck, faSyringe} from "@fortawesome/free-solid-svg-icons";

type Routes = {
    path?: string,
    name: string,
    icon?: IconDefinition,
    children?: Array<Routes>,
    header?: boolean,
    badgeColor?: string,
    badgeText?: string,
    open?: boolean,
    containsHome?: boolean,
    isDashboard?: boolean
    isTop5?: boolean,
    isAss?: boolean
}

const dashboardRoute : Routes = {
    path: '/',
    name: "DashBoard",
    icon: faHome,
    isDashboard: true
}

const top5Route : Routes = {
    path: '/Top5',
    name: "Top 5",
    icon: faChartColumn,
    isTop5: true
}

const securityRoute : Routes = {
    path: '/FicheSecurite/creation', // Si pas les droits d'ajout, consultation
    name: "Fiche Sécurité",
    icon: faHeart
}

const infirmaryRoute : Routes = {
    path: '/ficheInfirmerie/creation',
    name: "Fiche Infirmerie",
    icon: faSyringe
}

const auditRoute: Routes = {
  path: "/AuditTerrain/Audit",
  name: "Audit Terrain",
  icon: faCheck
}

const suggestion : Routes = {
    path: "/Suggestion/Creation",
    name: "Suggestion",
    icon: faLightbulb
}

const assignation : Routes = {
    path: '/Assignation/PDCA',
    name: "Assignation",
    icon: faListCheck,
    isAss: true
}

const documentationRoute: Routes = {
  path: "/Documentations",
  name: "Documentations",
  icon: faBook,
  children: [
    { path: "/Documentations/Dashboard", name: "Dashboard" },
    { path: "/Documentations/Top5", name: "Top 5" },
    { path: "/Documentations/FicheSecurite", name: "Fiche Sécurité" },
    { path: "/Documentations/Versions", name: "Versions" },
  ],
};

export default [
    dashboardRoute,
    top5Route,
    securityRoute,
    infirmaryRoute,
    auditRoute,
    suggestion,
    assignation,
    documentationRoute
]