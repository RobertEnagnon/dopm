import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardHeader,
} from "reactstrap";
import InjuredCategory from "../components/injuredCategory";
import MaterialElements from "../components/materialElements";
import LesionDetails from "../components/lesionDetails";
import CareProvided from "../components/careProvided";
//import Responsable from "../components/responsible";
//import Notifications from "./Notifications";
import Classification from "../components/classification";
import { permissionsList } from "../../../models/Right/permission";
import { useUser } from "../../../components/context/user.context";
import Notifications from "../components/notifications/Notifications";

const Parametre = (props: { tab: string }) => {
  const userContext = useUser();
  const currentPermissions = {
    parametrageFicheInf: userContext.checkAccess(
      permissionsList.parametrageFicheInf
    ),
  };

  const TABS = [
    {
      title: "identification",
      label: "Identification du blessé",
      component: (
        <TabPane tabId="identification">
          <InjuredCategory />
        </TabPane>
      ),
    },
    {
      title: "material",
      label: "Éléments matériels",
      component: (
        <TabPane tabId="material">
          <MaterialElements />
        </TabPane>
      ),
    },
    {
      title: "details",
      label: "Détails des lésions",
      component: (
        <TabPane tabId="details">
          <LesionDetails />
        </TabPane>
      ),
    },
    {
      title: "care",
      label: "Soins réalisés",
      component: (
        <TabPane tabId="care">
          <CareProvided />
        </TabPane>
      ),
    },
    {
      title: "notifications",
      label: "Notifications",
      component: (
        <TabPane tabId="notifications">
          <Notifications />
        </TabPane>
      ),
    },
    {
      title: "treatment",
      label: "Traitements",
      component: (
        <TabPane tabId="treatment">
          <Classification />
        </TabPane>
      ),
    },
  ];

  const lastActiveParameterTab =
    localStorage.getItem("fiLastActiveParameterTab") || props.tab;
  const [activeTab, setActiveTab] = useState<string>(lastActiveParameterTab);

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      localStorage.setItem("fiLastActiveParameterTab", tab);
      setActiveTab(tab);
    }
  };

  return !currentPermissions?.parametrageFicheInf ? (
    <p className="alert-panel">Permission insuffisante</p>
  ) : (
    <>
      <Row>
        <Col md={{ size: 12, offset: 0 }}>
          <Card>
            <CardHeader style={{ backgroundColor: "white" }}>
              <Nav>
                {TABS.map((tab) => {
                  return (
                    <NavItem key={tab.title}>
                      <NavLink
                        className={"dopm-tab"}
                        onClick={() => toggle(tab.title)}
                        style={{ cursor: "pointer" }}
                      >
                        {tab.label}
                        {activeTab === tab.title && (
                          <div className="dopm-active-tab-indicator" />
                        )}
                      </NavLink>
                    </NavItem>
                  );
                })}
              </Nav>
            </CardHeader>
            <CardBody>
              <TabContent activeTab={activeTab}>
                {TABS.map((tab) => {
                  return (
                    <React.Fragment key={"content-" + tab.title}>
                      {tab.component}
                    </React.Fragment>
                  );
                })}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Parametre;
