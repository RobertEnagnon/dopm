import { useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { getUserInformations } from "../../services/ad"
import { toast, ToastContainer } from "react-toastify";
import { Language } from '../../services/enums/Language';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../components/context/user.context';
import { useDashboard } from '../../hooks/dashboard';
import { User } from '../../models/user';
import { useNavigate } from "react-router-dom";
import { permissionsList } from "../../models/Right/permission";

const LoadingProfile = () => {

    const { i18n } = useTranslation();
    const userContext = useUser();
    const { dashboards, FetchDashboards } = useDashboard();
    const navigate = useNavigate();

    useEffect(() => {

        const queryParams = new URLSearchParams(window.location.search)
        const token = queryParams.get("token")

        if (token) {
            localStorage.setItem("authToken", token);
            getUserInformations().then((user) => {
                console.log(user)
                setToken(true, user!.accessToken, user)
            }).catch((err) => {
                console.log(err);
                toast.error("Utilisateur non reconnu");
            });
        } else {
            toast.error("Token invalide");
        }
    }, []);

    const setToken = async (ok: boolean, response: string, user?: User) => {
        if (ok) {
            if (user) {
                console.log(user.language)
                if (user.language == "2") {
                    localStorage.setItem("lang", Language.EN);
                    localStorage.setItem("languageName", "english");
                    i18n.changeLanguage(Language.EN);
                } else if (user.language == "3") {
                    localStorage.setItem("lang", Language.SP);
                    localStorage.setItem("languageName", "spanish");
                    i18n.changeLanguage(Language.SP);
                } else {
                    localStorage.setItem("lang", Language.FR);
                    localStorage.setItem("languageName", "french");
                    i18n.changeLanguage(Language.FR);
                }
            }

            if (user && user.id) {
                toast.success("Connexion réussie");
                localStorage.setItem("user", JSON.stringify(user));
                userContext.setCurrentUser(user);
                userContext.setIsConnected(true);
                localStorage.setItem(
                    "lastuserprofileimg",
                    JSON.stringify(user.url)
                );
                if (dashboards.length == 0) {
                    console.log("LoadingProfile - FetchDashboards");
                    const fetchedDashboards = await FetchDashboards();
                    const allowedDashboards = fetchedDashboards.filter(dashboard =>
                      userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
                      || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))
                    navigate(`/dashboard/${allowedDashboards.length === 0 ? 'undefined' : allowedDashboards[0].id}`);
                } else {
                    console.log("LoadingProfile - Dashboard already loaded");
                    const allowedDashboards = dashboards.filter(dashboard =>
                      userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
                      || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))
                    navigate(`/dashboard/${allowedDashboards.length === 0 ? 'undefined' : allowedDashboards[0].id}`);
                }
            } else if (user) {
                console.log("Utilisateur non confirmé");
                toast.error("Votre compte n'est pas confirmé");
            }

        } else if (!ok) {
            toast.error(response);
        }
    }

    return (
        <section className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <h1>Chargement du profil</h1>
            <Spinner
                color="primary"
                style={{
                    height: '3rem',
                    width: '3rem'
                }}>{" "}
            </Spinner>
        </section>
    )
}

export default LoadingProfile;