import { useDopm } from "../components/context/dopm.context";
import Wrapper from "../components/layout/wrapper";
import Main from "../components/layout/main";
import Sidebar from "../components/layout/sidebar/sidebar"
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Content from "../components/layout/content";
import { useUser } from "../components/context/user.context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Layout = ({ children }: any) => {
    const dopm = useDopm();
    const userContext = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (userContext.currentUser.username == '') {
          userContext.checkToken().then((isAllowed: boolean) => {
            if (!isAllowed) {
              navigate('Auth/SignIn')
            }
          })
        }
    })

    return (
        <>
            <Wrapper>
                {!dopm.isSidebarOnRight && <Sidebar />}
                <Main>
                    <Navbar />
                    <Content>{children}</Content>
                    <Footer />
                </Main>
                {dopm.isSidebarOnRight && <Sidebar />}
            </Wrapper>
        </>
    )
}

export default Layout;