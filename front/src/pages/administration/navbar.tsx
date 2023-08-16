import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  Row,
  TabContent,
} from "reactstrap";
import React, { useState } from "react";
import HeaderTitle from "../../components/layout/headerTitle";
import Header from "../../components/layout/header";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../../components/context/user.context";

const RightNavbar = () => {
  const [activeTab, setActiveTab] = useState<string>("groupes");
  const userContext = useUser();

  const TABS = [
    {
      name: "groupes",
      label: "Groupes",
      link: "/Administration/Groupes",
    },
    {
      name: "permissions",
      label: "Permissions",
      link: "/Administration/Permissions",
    },
    {
      name: "groupespermissions",
      label: "Permissions de groupes",
      link: "/Administration/GroupesPermissions",
    },
    {
      name: "branches",
      label: "Branches",
      link: "/Administration/Branches",
    },
    {
      name: "dashboards",
      label: "Dashboards",
      link: "/Administration/Dashboards",
    },
    {
      name: "asboards",
      label: "Assignation",
      link: "/Administration/AsBoards"
    },
    {
      name: "versions",
      label: "Versions",
      link: "/Administration/Versions",
    },
    {
      name: "ad",
      label: "AD",
      link: "/Administration/ad",
    },
  ];

  return (
    <>
      <Header>
        <HeaderTitle>Administration</HeaderTitle>
      </Header>
      <Row>
        <Col lg="12">
          <Card>
            <CardHeader style={{ backgroundColor: "white" }}>
              <Nav style={{ display: "flex", gap: "20px" }}>
                {TABS.map((tab) => {
                  return (
                    <NavItem key={tab.name}>
                      <Link
                        to={`${tab.link}`}
                        onClick={() => setActiveTab(tab.name)}
                        className="dopm-tab"
                        style={{ textDecoration: "none" }}
                      >
                        {tab.label}
                        {activeTab === tab.name && (
                          <div className="dopm-active-tab-indicator" />
                        )}
                      </Link>
                    </NavItem>
                  );
                })}
              </Nav>
            </CardHeader>
            <CardBody>
              <TabContent>
                {userContext.currentUser.roles === "admin" ? (
                  <Outlet />
                ) : (
                  <p className="alert-panel">Permission Insuffisante</p>
                )}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RightNavbar;
