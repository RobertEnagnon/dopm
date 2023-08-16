import { ToastContainer } from "react-toastify";

import { Container } from "reactstrap";
import { Outlet } from "react-router-dom";
import Layout from "../layout";
import NavbarAudit from "./components/navbar";
import './suggestion.scss'

const AuditTerrain = () => {
  return (
    <Layout>
      <Container fluid>
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
