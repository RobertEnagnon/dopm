import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleRight,
  faBell,
  faCog,
  faCogs,
  faInfoCircle,
  faUser,
  faUsersGear
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { useState, useEffect } from "react";
import { useDopm } from "../context/dopm.context";
import { Link } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ToastContainer } from "react-toastify";
import { notify, NotifyActions } from "../../utils/dopm.utils"
import { Version, formatDate } from "../../models/version";
import versionServices from "../../services/version";
import { getEnableConnection } from "../../services/ad";
import Clock from "./clock";
import { Badge } from "reactstrap";
import { useUser } from "../context/user.context";
import { defaultUser } from "../../models/user";

const NavbarToggle = () => {
  const dopm = useDopm();

  return (
    <span
      className="sidebar-toggle d-flex mr-2"
      onClick={() => {
        dopm.toggleSidebar();
      }}
    >
      <i className="hamburger align-self-center" />
    </span>
  );
};

type NavbarDropdownProps = {
  children: any;
  count?: number;
  header: any;
  footer?: any;
  footerRoute?: string;
  icon: IconProp;
  active?: boolean;
  indicator: boolean;
  onClick?: () => void
};

const NavbarDropdown = ({
  children,
  count,
  header,
  footer,
  footerRoute,
  icon,
  active,
  indicator,
  onClick
}: NavbarDropdownProps) => {
  return (
    <UncontrolledDropdown nav inNavbar className="ml-lg-1" active={active} onClick={onClick}>
      <DropdownToggle
        nav
        className="nav-icon dropdown-toggle position-relative"
      >
        <FontAwesomeIcon icon={icon} className="align-middle" />
        {indicator ? <span className="indicator" /> : ""}
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-lg dropdown-menu-right">
        <div className="dropdown-menu-header position-relative">
          {count} {header}
        </div>
        <ListGroup>{children}</ListGroup>
        <DropdownItem header className="dropdown-menu-footer">
          <Link to={footerRoute ? footerRoute : "/"}>
            <span className="text-muted">{footer}</span>
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

type NavbarDropdownItemProps = {
  icon?: any;
  title: string;
  description: string;
  time: string;
  spacing?: boolean;
};

const NavbarDropdownItem = ({
  icon,
  title,
  description,
  time,
  spacing,
}: NavbarDropdownItemProps) => {
  return (
    <ListGroupItem key={title}>
      <Row className={ spacing ? "m-1" : "" } style={{ width: "20rem" }}>
        {icon && <Col xs={1}>{icon}</Col>}
        <Col xs={icon ? 11 : 12}>
          {/* <div className="text-dark" >{title}</div> */}
          <Badge color="primary" style={{ fontSize: "90%" }}>{title}</Badge>
          <div className="text-muted small" style={{ whiteSpace: 'pre-line' }}>{description}</div>
          <p className="text-primary mt-1 mb-0 small" >{time}</p>
        </Col>
      </Row>
    </ListGroupItem >
  );
};

const NavbarDropdowns = () => {
  const userContext = useUser();
  // const dopm = useDopm();

  const disconnect = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    userContext.setIsConnected(false);
    userContext.setCurrentUser(defaultUser);
  };


  // Dernière version utilisée par l'utilsateur, enregistrée dans le browser
  let [currentVersion, setCurrentVersion] = useState(versionServices.GetCurrentVersion())

  // Liste des versions de l'application
  const [versions, setVersions] = useState<Version[]>([])

  const [existConnection, setExistConnection] = useState<boolean>(false)


  useEffect(() => {
    getCurrentConnection();
  }, [])

  const getCurrentConnection = async () => { // check si une connexion AD existe
    const connection = await getEnableConnection();
    setExistConnection(connection || false);
  }


  useEffect(() => {
    let isMounted = true;

    // Récupérer la liste des versions depuis le serveur
    async function getVersions() {

      const res = await versionServices.GetAllVersion();
      if (!res || res.status != 201) {
        notify("Impossible de récupérer la liste des versions", NotifyActions.Error)
        return;
      }

      let versions = res.data.map((d: any) => ({
        id: d.id,
        name: d.name,
        date: d.date,
        features: d.features.map((f: any) => f.name)
      }))

      // On ne garde que les deux dernières versions à afficher
      if (versions.length > 2)
        versions = versions.slice(-2)

      if (isMounted) setVersions(versions)
    }

    // Stocker les versions une fois que la barre de notif est rendue
    const jwt = localStorage.getItem("authToken")
    if (jwt) getVersions();

    return () => {
      isMounted = false;
    };

  }, [currentVersion])

  // Return true si la dernière version enregistrée sur le serveur
  // n'est pas la même que celle de l'utilisateur
  const displayVersionNotif = () => {

    // Si aucune version => pas de notif
    if (!versions.length)
      return false;

    // Si aucune version encore enregistrée => notif
    const currentVersion = versionServices.GetCurrentVersion();
    if (!currentVersion)
      return true;

    // Si la dernière version est différente que celle sur le serveur => notif
    if (currentVersion != versions[versions.length - 1].name)
      return true;
    else return false;
  }

  return (
    <>
      <ToastContainer />
      {/* <Clock />  */}
      {/* <div style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
      }}>
        <div style={{ fontWeight: 600, letterSpacing: "5px" }}>DOPM</div>
        {!dopm.isMobileDevice && <div style={{ fontSize: "0.8rem" }}>Digital Operational Performance Management</div>}
      </div> */}
      <Collapse navbar>
        <Nav navbar>

          <NavbarDropdown
            header="Versions de DOPM : "
            footer="Voir toutes les versions"
            footerRoute="/Documentations/Versions"
            icon={faInfoCircle}
            indicator={displayVersionNotif()}
            // Enregistrer le numéro de version pour ne plus afficher le point orange
            onClick={() => {
              if (versions.length) {
                const version = versions[versions.length - 1];
                versionServices.SetCurrentVersion(version.name)
                setCurrentVersion(version.name)
              }
            }}
          >
            {versions.slice(0).reverse().map((v: Version) =>
              <Link to="/Documentations/Versions" style={{ cursor: "pointer" }}>
                <NavbarDropdownItem
                  spacing={true}
                  title={v.name}
                  description={v.features.join("\n")}
                  time={formatDate(v.date)} />
              </Link>
            )}
          </NavbarDropdown>

          <NavbarDropdown
            header="Nouvelles notifications"
            footer="Voir toutes les notifications"
            icon={faBell}
            count={0}
            indicator={true}
          >
            <NavbarDropdownItem
              title="Notif Importante"
              description="Redémarrage du serveur 12 pour terminer la mise à jour"
              time="Il y a 2heures"
              spacing={true}
            />
            {/* TODO: Liste des notifications */}
          </NavbarDropdown>

          <UncontrolledDropdown nav inNavbar className="ml-lg-1">
            <DropdownToggle nav
              className="nav-icon dropdown-toggle position-relative">
              <FontAwesomeIcon icon={faCog} className="align-middle" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-right">
              {/*Link to profile*/}
              <Link to="/Profile">
                <DropdownItem style={{ color: "#0513af" }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    fixedWidth
                    style={{ color: "black" }}
                    className="mr-2 align-middle"
                  />
                  Voir le profil
                </DropdownItem>
              </Link>
              {/*Link to settings*/}
              <Link to="/Setting">
                <DropdownItem style={{ color: "#0513af" }}>
                  <FontAwesomeIcon
                    icon={faCogs}
                    fixedWidth
                    style={{ color: "black" }}
                    className="mr-2 align-middle"
                  />
                  Paramètres
                </DropdownItem>
              </Link>
              {
                userContext.currentUser.roles === 'admin'
                  ? (
                    <>
                      <DropdownItem divider />
                      <DropdownItem>
                        <FontAwesomeIcon
                          icon={faUsersGear}
                          fixedWidth
                          className="mr-2 align-middle"
                        />
                        {/*TODO: Link to sign-in*/}
                        <Link to="/Administration/Groupes">
                          Administration
                        </Link>
                      </DropdownItem>
                    </>
                  )
                  : ''
              }
              <DropdownItem divider />
              {/*Link to sign-in*/}
              {existConnection ?
                <a href={process.env.REACT_APP_API + '/auth/logout/sso'} onClick={disconnect}>
                  <DropdownItem style={{ color: "#0513af" }}>
                    <FontAwesomeIcon
                      icon={faArrowAltCircleRight}
                      fixedWidth
                      style={{ color: "#BF2909" }}
                      className="mr-2 align-middle"
                    />
                    Se déconnecter
                  </DropdownItem>
                </a> :
                <Link to={"/Auth/SignIn"} onClick={disconnect}>
                  <DropdownItem style={{ color: "#0513af" }}>
                    <FontAwesomeIcon
                      icon={faArrowAltCircleRight}
                      fixedWidth
                      style={{ color: "#BF2909" }}
                      className="mr-2 align-middle"
                    />
                    Se déconnecter
                  </DropdownItem>
                </Link>}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </>
  );
};

const NavbarComponent = () => {
  const dopm = useDopm();

  return (
    // <Navbar  style={{ border: "solid white 5px" }}>

    <>
      <Row  style={{ }} >
        <Col md={3} xs={3} style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "25px" }} >
          <NavbarToggle /><Clock />
        </Col>
        <Col  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "white", marginTop: "1vh", margin: "auto" }}>
            <div style={{ fontWeight: 500, fontSize: "1.1rem", letterSpacing: "5px", margin: "auto" }}>DOPM</div>
            {!dopm.isMobileDevice && <div style={{ fontSize: "0.8rem" }}>Digital Operational Performance Management</div>}
          </div>
        </Col>
        <Col md={{ size: 3, offset: 0 }} xs={3} style={{}}>
          <Navbar expand container={false} className="navbar-theme" style={{ float: "right" }} >
            <NavbarDropdowns />
          </Navbar>
        </Col>
      </Row>
    </>

    // </Navbar>
  );
};

export default NavbarComponent;
