import ReactDOM from "react-dom";
import "./style/index.css";
import App from "./pages/app";
import { BrowserRouter } from "react-router-dom";
import { DopmProvider } from "./components/context/dopm.context";
import { Top5Provider } from "./components/context/top5.context";
import { UserProvider } from "./components/context/user.context";
import "./i18n";
import "./style/dopm.scss";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {AssignationProvider} from "./components/context/assignation.context";

ReactDOM.render(
  <DopmProvider>
    <UserProvider>
      <Top5Provider>
        {/*<AssignationProvider>*/}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/*</AssignationProvider>*/}
      </Top5Provider>
    </UserProvider>
  </DopmProvider>,
  document.getElementById("root")
);
