import './assignation.scss';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { Container } from "reactstrap";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "../layout";
import NavbarAssignation from "./components/navbar";
import { AssignationProvider } from "../../components/context/assignation.context";

const Assignation = () => {
  const location  = useLocation();

  return (
    <AssignationProvider>
      <Layout>
        <Container fluid className={location.pathname.includes('PDCA') && location.pathname.includes('responsibles') ? 'max-fluid' : ''}>
          <NavbarAssignation />
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
    </AssignationProvider>
  );
};

export default Assignation;
