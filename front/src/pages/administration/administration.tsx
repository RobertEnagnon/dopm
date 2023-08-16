import { Container } from "reactstrap";
import Layout from '../layout';
import RightNavbar from "./navbar";
import { ToastContainer } from "react-toastify";

const Administration = () => {
  return (
    <Layout>
      <Container fluid>
        <RightNavbar />
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
  )
}

export default Administration;