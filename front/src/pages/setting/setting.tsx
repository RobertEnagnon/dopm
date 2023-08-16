import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../layout";
import "../../style/dopm.scss";

import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
} from "reactstrap";

import Header from "../../components/layout/header";
import HeaderTitle from "../../components/layout/headerTitle";
import UsersTab from "./tab/userTab/user";
import { useUser } from "../../components/context/user.context";
import { ToastContainer } from "react-toastify";
import Services from "./tab/service";
import Team from "./tab/team";
import Zones from "./tab/zone";
import RolesTab from "./tab/roles/roles";

import { permissionsList } from "../../models/Right/permission";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("user");
  const userContext = useUser();
  const navigate = useNavigate();

  const tabs = [
    {
      title: "user",
      label: "Utilisateurs",
      component: (
        <TabPane tabId="user">
          {userContext.checkAccess(
            permissionsList.gestionUtilisateursEtDroits
          ) || userContext.currentUser.roles === "admin" ? (
            <UsersTab />
          ) : (
            <p className="alert-panel">Permission insuffisante.</p>
          )}
        </TabPane>
      ),
    },
    {
      title: "rights",
      label: "Rôles Utilisateurs",
      component: (
        <TabPane tabId="rights">
          {userContext.checkAccess(
            permissionsList.gestionUtilisateursEtDroits
          ) || userContext.currentUser.roles === "admin" ? (
            <RolesTab />
          ) : (
            <p className="alert-panel">Permission insuffisante.</p>
          )}
        </TabPane>
      ),
    },
    {
      title: "services",
      label: "Services",
      component: (
        <TabPane tabId="services">
          <Services />
        </TabPane>
      ),
    },
    {
      title: "teams",
      label: "Équipes",
      component: (
        <TabPane tabId="teams">
          <Team />
        </TabPane>
      ),
    },
    {
      title: "zones",
      label: "Zones",
      component: (
        <TabPane tabId="zones">
          <Zones />
        </TabPane>
      ),
    },
  ];

  useEffect(() => {
    if (userContext.currentUser.username == "") {
      navigate("/Auth/SignIn");
    }
  });

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <ToastContainer
        key="a145"
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

      <Layout>
        <Container fluid>
          <Header>
            <HeaderTitle>Paramètrage</HeaderTitle>

            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Dashboard</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Paramètrage</BreadcrumbItem>
            </Breadcrumb>
          </Header>

          <Row>
            <Col lg="12">
              <Card>
                <CardHeader style={{ backgroundColor: "white" }}>
                  <Nav>
                    {tabs.map((tab) => {
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
                    {tabs.map((tab) => {
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
        </Container>
      </Layout>
    </>
  );
};

export default Setting;
