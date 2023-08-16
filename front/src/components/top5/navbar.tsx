import {
    Col,
    Row,
} from "reactstrap";
  import {
  faBook,
  faCog,
  faHistory,
  faChartColumn, IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {Link, useLocation} from "react-router-dom";
  import './navbar.scss';
  import Header from "../layout/header";
  import HeaderTitle from "../layout/headerTitle";
import {permissionsList} from "../../models/Right/permission";
import {useEffect, useState} from "react";
import {Category} from "../../models/Top5/category";
import {useUser} from "../context/user.context";


type NavbarProps = {
  branchName: string,
  branchId: number,
  categories: Array<Category>,
}

const Navbar = ( { branchName, branchId, categories } : NavbarProps ) => {
    const userContext = useUser();
    const location = useLocation();
    const [Top5Routes, setTop5Routes] = useState<Array<{ to: string, icon: IconDefinition , label: string }>>([]);
    const manageNavbar = async () => {
      const routes = [];
      const alreadyPushed = {
        charts: false,
        dataform: false,
        histoform: false,
        settings: false
      };

      if (categories.length) {
        for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
          if (!alreadyPushed.charts) {
            const isAllowed = userContext.checkAccess(permissionsList.lectureGraphique, branchId, categories[categoryIndex].id)
              || userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branchId, categories[categoryIndex].id)
            if (isAllowed) {
              alreadyPushed.charts = true
            }
          }

          if (!alreadyPushed.dataform) {
            const isAllowed = userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branchId, categories[categoryIndex].id)
            if (isAllowed) {
              alreadyPushed.dataform = true
            }
          }

          if (!alreadyPushed.histoform) {
            const isAllowed = userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branchId, categories[categoryIndex].id)
            if (isAllowed) {
              alreadyPushed.histoform = true
            }
          }

          if (!alreadyPushed.settings) {
            const isAllowed = userContext.checkAccess(permissionsList.parametrageTop5, branchId, categories[categoryIndex].id)
            if (isAllowed) {
              alreadyPushed.settings = true
            }
          }
        }
      } else {
        alreadyPushed.charts = userContext.checkAccess(permissionsList.lectureGraphique, branchId)
          || userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branchId)
        alreadyPushed.dataform = userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branchId)
        alreadyPushed.histoform = userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branchId)
        alreadyPushed.settings = userContext.checkAccess(permissionsList.parametrageTop5, branchId)
      }

      if (alreadyPushed.charts) {
          routes.push({
            to: `/Top5/${branchName}`,
            icon: faChartColumn ,
            label: 'KPI'
          });
      }

      if (alreadyPushed.dataform) {
          routes.push({
            to: `/Top5/dataform/${branchName}`,
            icon: faBook,
            label: 'Données'
          });
      }

      if (alreadyPushed.histoform) {
          routes.push({
            to: `/Top5/histoform/${branchName}`,
            icon: faHistory,
            label: 'Historiques'
          });
      }

      if (alreadyPushed.settings) {
          routes.push({
            to: `/Top5/settings/${branchName}`,
            icon: faCog,
            label: 'Paramètres'
          });
      }

      setTop5Routes(routes);
    }

    useEffect(() => {
      manageNavbar();
    }, [branchName, categories]);

    return (
        <>
            <Header >
                <HeaderTitle>
                    <Row style={{marginTop: '-20px', marginBottom:'-10px'}}>
                        <Col md={2} xs={2} style={{ display: 'flex', flexDirection: 'row' }}>
                            {Top5Routes?.map(route=>{
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
                        </Col>
                        <Col md={8} xs={8} className="text-center">
                            <HeaderTitle>{`Top5 ${branchName}`}</HeaderTitle>
                        </Col>
                    </Row>
                </HeaderTitle>
            </Header>

        </>
    )
}

export default Navbar;



