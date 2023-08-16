import {
  Col,
  Row,
} from "reactstrap";
import {
  faPeopleLine,
  faCog,
  faUserCheck,
  faMagnifyingGlassChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import './navbar.scss';
import Header from "../../../components/layout/header";
import HeaderTitle from "../../../components/layout/headerTitle";
import { useUser } from "../../../components/context/user.context";
import { permissionsList } from "../../../models/Right/permission";
import { useDopm } from "../../../components/context/dopm.context";


const NavbarAuditTerrain = () => {
  const location = useLocation();
  const dopmContext = useDopm();
  const userContext = useUser();
  const currentPermissions = {
    realisationAuditTerrain: userContext.checkAccess(
      permissionsList.realisationAuditTerrain
    ),
    parametrageAuditTerrain: userContext.checkAccess(
      permissionsList.parametrageAuditTerrain
    )
  };

  const AuditRoutes = [];

  if (currentPermissions?.realisationAuditTerrain) {
    AuditRoutes.push({
      to: `/AuditTerrain/Audit`,
      icon: faUserCheck,
      label: 'Audit Terrain'
    }, {
      to: `/AuditTerrain/FaceToFace`,
      icon: faPeopleLine,
      label: 'Face à Face'
    }, {
      to: `/AuditTerrain/Analyse`,
      icon: faMagnifyingGlassChart,
      label: 'Analyse'
    });
  }

  if (currentPermissions?.parametrageAuditTerrain) {
    AuditRoutes.push({
      to: `/AuditTerrain/parametres`,
      icon: faCog,
      label: 'Paramètres'
    });
  }

  return (
    <>
      <Header >
        <HeaderTitle>
          <Row style={{ marginTop: '-20px', marginBottom: '-10px' }}>
            {!dopmContext.isMobileDevice && <Col md={2} style={{ display: 'flex', flexDirection: 'row' }}>
              {AuditRoutes?.map(route => {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column' }} title={route.label} >
                    <Link to={route.to} replace >
                      <FontAwesomeIcon
                        color="#FFF"
                        style={{ fontSize: "0.85em", margin: "4px" }}
                        icon={route.icon}
                        className="align-middle"
                      />
                    </Link>
                    {location.pathname === route.to &&
                      <div
                        style={{
                          content: '',
                          borderBottom: '2px solid white',
                          width: '10px',
                          margin: 'auto',
                          borderRadius: '2px'
                        }}
                      />
                    }
                  </div>
                )
              })}
            </Col>}
            <Col md={8} className="text-center">
              <HeaderTitle>{`Audit Terrain`}</HeaderTitle>
            </Col>
          </Row>
        </HeaderTitle>
      </Header>

    </>
  )
}

export default NavbarAuditTerrain;
