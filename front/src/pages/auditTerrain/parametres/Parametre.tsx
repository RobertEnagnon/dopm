import {Row, Card, Col, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, CardHeader} from "reactstrap";
import {useState} from "react";
import Atcategories from "../components/atcategories";
import Checkpoint from "../components/checkpoint";
import Atmap from "../components/atmap";
import "../../../style/dopm.scss";

const Parametre = () => {
  const PARAMETERS_TAB = [
      { title: 'Catégories', component: <Atcategories /> },
      { title: 'Checkpoints', component: <Checkpoint /> },
      { title: 'Carte', component: <Atmap />},
      // { title: 'Extraction', component: <h1>Extraction</h1> },
  ]
  const lastActiveAuditParameterTab = localStorage.getItem('lastActiveAuditParameterTab') || '0'
  const [activeTab, setActiveTab] = useState<string>(lastActiveAuditParameterTab);

  const toggle = (tab: string) => {
    if( activeTab !== tab ) {
      localStorage.setItem('lastActiveAuditParameterTab', tab);
      setActiveTab(tab);
    }
  }

  return (
    <>
      <Row>
        <Col md={{ size: 12, offset: 0 }}>
          <Card>
            <CardHeader className="bg-white">
              <Nav>
                {PARAMETERS_TAB.map((tab, index) => {
                  return (
                      <NavItem key={`tab${tab.title}`}>
                        <NavLink
                            className={"dopm-tab"}
                            onClick={() => {
                              toggle(index.toString())
                            }}
                            style={{ cursor: "pointer" }}
                        >
                          {tab.title}
                          {activeTab === index.toString() && (
                              <div className="dopm-active-tab-indicator" />
                          )}
                        </NavLink>
                      </NavItem>
                  )
                })}
              </Nav>
            </CardHeader>
            <CardBody>
                <TabContent
                  activeTab={activeTab}
                >
                  <TabPane tabId={activeTab}>
                    {PARAMETERS_TAB[parseInt(activeTab)].component}
                  </TabPane>
                </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Parametre;
