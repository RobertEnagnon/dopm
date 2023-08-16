import HeaderTitle from "../../../components/layout/headerTitle";
import { Col, Row } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChartPie,
  faCog,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/layout/header";
import { useTranslation } from "react-i18next";
import { permissionsList } from "../../../models/Right/permission";
import { useUser } from "../../../components/context/user.context";
import { useDopm } from "../../../components/context/dopm.context";

const NavbarFicheSecurite = () => {
  const dopm = useDopm();
  const userContext = useUser();
  const location = useLocation();
  const currentPermissions = {
    ajoutFicheSecurite: userContext.checkAccess(
      permissionsList.ajoutFicheSecurite
    ),
    lectureStatistiquesFicheSecurite: userContext.checkAccess(
      permissionsList.lectureStatistiquesFicheSecurite
    ),
    lectureFicheSecurite: userContext.checkAccess(
      permissionsList.lectureFicheSecurite
    ),
    traitementFicheSecurite: userContext.checkAccess(
      permissionsList.traitementFicheSecurite
    ),
    parametrageFicheSecurite: userContext.checkAccess(
      permissionsList.parametrageFicheSecurite
    ),
  };
  const FSRoutes = [];
  if (currentPermissions?.ajoutFicheSecurite) {
    FSRoutes.push({
      to: "/FicheSecurite/creation",
      icon: faPlusSquare,
      label: "Création Fiche Sécurité",
    });
  }

  if (
    currentPermissions?.lectureFicheSecurite ||
    currentPermissions?.traitementFicheSecurite
  ) {
    FSRoutes.push({
      to: "/FicheSecurite/consultation",
      icon: faBook,
      label: "Consultation",
    });
  }

  if (currentPermissions?.lectureStatistiquesFicheSecurite) {
    FSRoutes.push({
      to: "/FicheSecurite/statistiques",
      icon: faChartPie,
      label: "Graphiques",
    });
  }

  if (currentPermissions?.parametrageFicheSecurite) {
    FSRoutes.push({
      to: "/FicheSecurite/parametres",
      icon: faCog,
      label: "Paramètres",
    });
  }
  const { t } = useTranslation();
  return (
    <Header>
      <HeaderTitle>
        <Row style={{ marginTop: "-20px", marginBottom: "-10px" }}>
          {!dopm.isMobileDevice ? (
            <Col md={2} style={{ display: "flex", flexDirection: "row" }}>
              {FSRoutes?.map((route) => {
                return (
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                    title={route.label}
                    key={route.label}
                  >
                    <Link to={route.to}>
                      <FontAwesomeIcon
                        color="#FFF"
                        style={{ fontSize: "0.85em", margin: "4px" }}
                        icon={route.icon}
                        className="align-middle"
                      />
                    </Link>
                    {location.pathname === route.to && (
                      <div
                        style={{
                          content: "",
                          borderBottom: "2px solid white",
                          width: "10px",
                          margin: "auto",
                          borderRadius: "2px",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </Col>
          ) : null}
          <Col md={8} className="text-center">
            {t("fichesecurite.fichesecurite")}
          </Col>
        </Row>
      </HeaderTitle>
    </Header>
  );
};

export default NavbarFicheSecurite;
