import { ToastContainer } from "react-toastify";

import {
  Container,
} from "reactstrap";
import { Outlet } from "react-router-dom";
import Layout from "../layout";
import NavbarFicheInfirmerie from "./navbar";

const FicheSecurite = () => {
  return (
    <Layout>
      <Container fluid>
        <NavbarFicheInfirmerie />
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

export default FicheSecurite;
