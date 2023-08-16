import { Col, Row } from "reactstrap";
import { faPlusSquare, faBook, faCog, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import "./navbar.scss";
import Header from "../../../components/layout/header";
import HeaderTitle from "../../../components/layout/headerTitle";

const NavbarAuditTerrain = () => {
  const location = useLocation();

  const AuditRoutes = [
    {
      to: `/Suggestion/Creation`,
      icon: faPlusSquare,
      label: "Suggestion",
    },
    {
      to: `/Suggestion/Consultation`,
      icon: faBook,
      label: "Consultation",
    },
    {
      to: `/Suggestion/statistiques`,
      icon: faChartPie,
      label: "Graphiques",
    },
    {
      to: "/Suggestion/Settings",
      icon: faCog,
      label: "Paramètres",
    },
  ];

  return (
    <>
      <Header>
        <HeaderTitle>
          <Row style={{ marginTop: "-20px", marginBottom: "-10px" }}>
            <Col md={2} style={{ display: "flex", flexDirection: "row" }}>
              {AuditRoutes?.map((route) => {
                return (
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                    title={route.label}
                  >
                    <Link to={route.to} replace>
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
            <Col md={8} className="text-center">
              <HeaderTitle>{`Suggestion`}</HeaderTitle>
            </Col>
          </Row>
        </HeaderTitle>
      </Header>
    </>
  );
};

export default NavbarAuditTerrain;
