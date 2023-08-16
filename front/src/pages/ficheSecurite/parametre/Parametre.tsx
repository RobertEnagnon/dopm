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
import FSCat from "../components/fscategory";
import Classification from "../components/classification";
import Notifications from "./Notifications";
import { permissionsList } from "../../../models/Right/permission";
import { useUser } from "../../../components/context/user.context";

const Parametre = (props: { tab: string }) => {
  const userContext = useUser();
  const currentPermissions = {
    parametrageFicheSecurite: userContext.checkAccess(
      permissionsList.parametrageFicheSecurite
    ),
  };

  const lastActiveParameterTab =
    localStorage.getItem("lastActiveParameterTab") || props.tab;
  const [activeTab, setActiveTab] = useState<string>(lastActiveParameterTab);

  const TABS = [
    {
      title: "categories",
      label: "Catégories",
      component: (
        <TabPane tabId="categories">
          <FSCat />
        </TabPane>
      ),
    },
    {
      title: "notifications",
      label: "Notification",
      component: (
        <TabPane tabId="notifications">
          <Notifications />
        </TabPane>
      ),
    },
    {
      title: "traitements",
      label: "Traitements",
      component: (
        <TabPane tabId="traitements">
          <Classification />
        </TabPane>
      ),
    },
  ];

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      localStorage.setItem("lastActiveParameterTab", tab);
      setActiveTab(tab);
    }
  };

  return !currentPermissions?.parametrageFicheSecurite ? (
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
              <TabContent style={{ paddingTop: "25px" }} activeTab={activeTab}>
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
