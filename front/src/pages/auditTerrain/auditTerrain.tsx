import { ToastContainer } from "react-toastify";

import {
  Container,
} from "reactstrap";
import { Outlet } from "react-router-dom";
import Layout from "../layout";
import NavbarAudit from "./navbar/navbar";
import { useDopm } from "../../components/context/dopm.context";

const AuditTerrain = () => {
  const dopmContext = useDopm();

  return (
    <Layout>
      <Container fluid={!dopmContext.isMobileDevice}>
        <NavbarAudit />
        <Outlet />
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
      </Container>
    </Layout>
  );
};

export default AuditTerrain;
