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

import { Category } from "./Category";
import { Comity } from "./Comity";
import { Classification } from "./Classification";

interface IndexPrios {
  tab: string;
}

export default function Index({ tab }: IndexPrios) {
  const TABS = [
    {
      title: "categories",
      label: "Catégories",
      component: (
        <TabPane tabId="categories">
          <Category />
        </TabPane>
      ),
    },
    {
      title: "comity",
      label: "Comité",
      component: (
        <TabPane tabId="comity">
          <Comity />
        </TabPane>
      ),
    },
    {
      title: "classification",
      label: "Classification",
      component: (
        <TabPane tabId="classification">
          <Classification />
        </TabPane>
      ),
    },
  ];

  const lastActiveParameterTab =
    localStorage.getItem("lastActiveSugSettingsTab") || tab;
  const [activeTab, setActiveTab] = useState<string>(lastActiveParameterTab);

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      localStorage.setItem("lastActiveSugSettingsTab", tab);
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Row>
        <Col md={{ size: 12, offset: 0 }}>
          <Card>
            <CardHeader>
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
}
