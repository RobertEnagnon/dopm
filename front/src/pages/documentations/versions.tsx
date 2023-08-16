import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Layout from '../layout';
import VersionJSX from "./version"

import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";

import Header from "../../components/layout/header";
import HeaderTitle from "../../components/layout/headerTitle";
import versionServices from "../../services/version"
import { ToastContainer } from "react-toastify";
import { notify, NotifyActions } from "../../utils/dopm.utils"

const Changelog = () => {

  const [versions, setVersions] = useState<any[]>([])

  useEffect(() => {
    async function getVersions() {
      const res = await versionServices.GetAllVersion();
      if (!res || res.status != 201) {
        notify("Impossible de récupérer la liste des versions", NotifyActions.Error)
        return;
      }

      const versions = res.data.map((d: any) => ({
        id: d.id,
        name: d.name,
        date: d.date,
        features: d.features.map((f: any) => f.name)
      }))

      setVersions(versions)
    }

    getVersions();
  }, [])

  return (
    <Layout>
      <Container fluid>
        <ToastContainer />
        <Header>
          <HeaderTitle>Versions</HeaderTitle>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/">Documentation</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Versions</BreadcrumbItem>
          </Breadcrumb>
        </Header>
        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
              </CardHeader>
              <CardBody>
                <div id="changelog">
                  {versions.slice().reverse().map(v => {
                    return (<VersionJSX key={v.id} version={v} />)
                  })}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container >
    </Layout >
  );
}

export default Changelog;