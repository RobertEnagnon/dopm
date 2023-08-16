//import {DopmProvider} from "../components/context/dopm.context";
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useUser } from "../components/context/user.context";

const Dashboard = lazy(() => import("./dashboard/dashboard"));
const DashboardAdministration = lazy(() => import("./administration/dashboards/dashboard"));
const Profile = lazy(() => import("./profile/profile"));
const Setting = lazy(() => import("./setting/setting"));
const Top5 = lazy(() => import("./top5/top5"));
const DocDashboard = lazy(() => import("./documentations/dashboard"));
const DocFS = lazy(() => import("./documentations/ficheSecurite"));
const DocTop5 = lazy(() => import("./documentations/top5"));
const DocVersions = lazy(() => import("./documentations/versions"));
const Charts = lazy(() => import("./top5/charts"));
const DataForm = lazy(() => import("./top5/dataform"));
const HistoForm = lazy(() => import("./top5/histoform"));
const Settings = lazy(() => import("./top5/settings/Settings"));

const Fichesecurite = lazy(() => import("./ficheSecurite/ficheSecurite"));
const FSCreation = lazy(() => import("./ficheSecurite/creation/index"));
const FSConsultation = lazy(() => import("./ficheSecurite/consultation/index"));
const FSTraitement = lazy(() => import("./ficheSecurite/traitement/Traitement"));
const FSStatistique = lazy(() =>import("./ficheSecurite/statistique/Statistique"));
const FSParametre = lazy(() => import("./ficheSecurite/parametre/Parametre"));

const Ficheinfirmerie = lazy(() => import("./ficheInfirmerie/ficheInfirmerie"));
const FICreation = lazy(() => import("./ficheInfirmerie/creation/index"));
const FIConsultation = lazy(() => import("./ficheInfirmerie/consultation/index"));
const FIParametre = lazy(() => import("./ficheInfirmerie/parametre/Parametre"));
const FITraitement = lazy(() => import("./ficheInfirmerie/traitement/Traitement"));

const AuditTerrain = lazy(() => import("./auditTerrain/auditTerrain"));
const ATAudit = lazy(() => import("./auditTerrain/audit/audit"));
const ATFaceToFace = lazy(() => import("./auditTerrain/facetoface/facetoface"));
const ATAnalyse = lazy(() => import("./auditTerrain/analyse/analyse"));
const ATParametres = lazy(() => import("./auditTerrain/parametres/Parametre"));
const Suggestion = lazy(() => import("./suggestion/suggestion"));
const SUGCréation = lazy(() => import("./suggestion/suggestion/index"));
const SUGConsultation = lazy(() => import("./suggestion/consultation/index"));
const SUGTraitement = lazy(() => import("./suggestion/traitement/index"));
const SugStatistique = lazy(() => import("./suggestion/statistique/index"));
const SUGSettings = lazy(() => import("./suggestion/settings/index"));
const SignIn = lazy(() => import("./auth/signIn"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));
const ResetPasswordToken = lazy(() => import("./auth/ResetPasswordToken"));
const LoadingProfile = lazy(() => import("./auth/loadingProfile"));
const Logout = lazy(() => import("./auth/logout"));
const Administration = lazy(() => import("./administration/administration"));
const RightGroupes = lazy(() => import("./administration/groupes/groupes"));
const RightPermissions = lazy(() => import("./administration/permissions/permissions"));
const RightGroupesPermissions = lazy(() => import("./administration/groupesPermissions/groupesPermissions"));
const BranchesAdministration = lazy(() => import("./administration/branches/branch"));
const VersionsAdministration = lazy(() => import("./administration/versions/version"));
const AdAdministration = lazy(() => import('./administration/ad'))
const Assignation = lazy(() => import("./assignation/assignation"));
const ASParametres = lazy(() => import("./assignation/parametres/Parametre"));
const PDCA = lazy(() => import("./assignation/pdca/pdca"));
const PDCAByResponsible = lazy(() => import("./assignation/pdcaByResponsible/pdca"));

import "react-toastify/dist/ReactToastify.css";
import { useDashboard } from "../hooks/dashboard";
import ErrorAd from "./auth/errorAd";
import { permissionsList } from "../models/Right/permission";
import AssignationTab from "./administration/assignations/assignation";

const App = () => {
  return (
    <div className="App">
      <Suspense fallback={
        <div className="loading">
          <Spinner
            color="primary"
            type="grow"
            style={{
              height: '3rem',
              width: '3rem'
            }}>{" "}
          </Spinner></div>
      }>
        <Routes>
          <Route path="/dashboard/:dashboardId" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Auth/SignIn" element={<SignIn />} />
          <Route path="/Auth/resetPassword" element={<ResetPassword />} />
          <Route
            path="/Auth/reset-password/token"
            element={<ResetPasswordToken />}
          />
          <Route path="/Auth/loading" element={<LoadingProfile />} />
          <Route path="/Auth/error" element={<ErrorAd />} />
          <Route path="/Auth/logout" element={<Logout />} />
          <Route path="/Setting" element={<Setting />} />
          <Route path="/Top5" element={<Top5 />}>
            <Route path="/Top5">
              <Route path="/Top5/:id" element={<Charts />} />
              <Route path="/Top5/dataform/:id" element={<DataForm />} />
              <Route path="/Top5/histoform/:id" element={<HistoForm />} />
              <Route path="/Top5/settings/:id" element={<Settings />} />
            </Route>
          </Route>
          <Route path="/FicheSecurite" element={<Fichesecurite />}>
            <Route path="/FicheSecurite/creation" element={<FSCreation />} />
            <Route
              path="/FicheSecurite/consultation"
              element={<FSConsultation />}
            />
            <Route
              path="/FicheSecurite/traitement/:id"
              element={<FSTraitement />}
            />
            <Route
              path="/FicheSecurite/statistiques"
              element={<FSStatistique />}
            />
            <Route
              path="/FicheSecurite/parametres"
              element={<FSParametre tab="1" />}
            />
          </Route>

          <Route path="/ficheInfirmerie" element={<Ficheinfirmerie />}>
            <Route 
              path="/ficheInfirmerie/creation" 
              element={<FICreation />} 
            />
            <Route
              path="/ficheInfirmerie/consultation"
              element={<FIConsultation />}
            />
            <Route
              path="/ficheInfirmerie/traitement/:id"
              element={<FITraitement />}
            /> 
            {/* <Route
              path="/ficheInfirmerie/statistiques"
              element={<FIStatistique />}
            />*/}
            <Route
              path="/ficheInfirmerie/parametres"
              element={<FIParametre tab="1" />}
            />
          </Route>

          <Route path="/AuditTerrain" element={<AuditTerrain />}>
            <Route path="/AuditTerrain/Audit" element={<ATAudit />} />
            <Route path="/AuditTerrain/FaceToFace" element={<ATFaceToFace />} />
            <Route path="/AuditTerrain/Analyse" element={<ATAnalyse />} />
            <Route path="/AuditTerrain/Parametres" element={<ATParametres />} />
          </Route>

          <Route path="/Suggestion" element={<Suggestion />}>
            <Route path="/Suggestion/Creation" element={<SUGCréation />} />
            <Route
              path="/Suggestion/Consultation"
              element={<SUGConsultation />}
            />
            <Route
              path="/Suggestion/Traitement/:id"
              element={<SUGTraitement />}
            />
            <Route
              path="/Suggestion/statistiques"
              element={<SugStatistique />}
            />
            <Route
              path="/Suggestion/Settings"
              element={<SUGSettings tab="1" />}
            />
          </Route>

          <Route path="/Assignation" element={<Assignation />}>
            <Route path=":asBoardId/PDCA" element={<PDCA />} />
            <Route path=":asBoardId/PDCA/responsibles" element={<PDCAByResponsible />} />
            <Route path=":asBoardId/Parametres" element={<ASParametres />} />
          </Route>

          <Route path="/Documentations">
            <Route path="/Documentations/FicheSecurite" element={<DocFS />} />
            <Route path="/Documentations/Top5" element={<DocTop5 />} />
            <Route
              path="/Documentations/Dashboard"
              element={<DocDashboard />}
            />
            <Route path="/Documentations/Versions" element={<DocVersions />} />
          </Route>

          <Route path="/Administration" element={<Administration />}>
            <Route path="Groupes" element={<RightGroupes />} />
            <Route path="Permissions" element={<RightPermissions />} />
            <Route path="GroupesPermissions" element={<RightGroupesPermissions />} />
            <Route path="Branches" element={<BranchesAdministration />} />
            <Route path="Dashboards" element={<DashboardAdministration />} />
            <Route path="AsBoards" element={<AssignationTab />} />
            <Route path="Versions" element={<VersionsAdministration />} />
            <Route path="ad" element={<AdAdministration />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const PageNotFound = () => {
  const { dashboards, isDashboardsFetched } = useDashboard();
  const navigate = useNavigate();
  const userContext = useUser();

  useEffect(() => {

    console.log("NOT FOUND")
    userContext.checkToken().then((isAllowed: boolean) => {
      if (!isAllowed) {
        navigate('Auth/SignIn')
      } else if (isDashboardsFetched) {
        const allowedDashboards = dashboards.filter(dashboard =>
          userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
          || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))
        navigate(`/dashboard/${allowedDashboards.length === 0 ? 'undefined' : allowedDashboards[0].id}`);
      }
    })
  }, [dashboards, isDashboardsFetched])

  return <></>
}

export default App;
