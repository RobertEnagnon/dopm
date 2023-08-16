import {Row, Card, Col, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, CardHeader} from "reactstrap";
import React, {useState} from "react";
import Ascategories from "../components/ascategories";
import "../../../style/dopm.scss";

const Parametre = () => {
    const PARAMETERS_TAB = [
        { title: 'Catégories', component: <Ascategories /> },
    ]
    const lastActiveAssignationParameterTab = localStorage.getItem('lastActiveAssignationParameterTab') || '0'
    const [activeTab, setActiveTab] = useState<string>(lastActiveAssignationParameterTab);

    const toggle = (tab: string) => {
        if( activeTab !== tab ) {
            localStorage.setItem('lastActiveAssignationParameterTab', tab);
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
                            <Row>
                                <Col md={{ size: 12, offset: 0 }}>

                                    <TabContent
                                        style={{ paddingTop: '25px' }}
                                        activeTab={activeTab}
                                    >
                                        <TabPane tabId={activeTab}>
                                            {PARAMETERS_TAB[parseInt(activeTab)]?.component}
                                        </TabPane>
                                    </TabContent>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Parametre;
