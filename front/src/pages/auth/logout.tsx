import React from 'react';
import { Button } from 'reactstrap';

const Logout = () => {

    const URL_LOGIN_SSO = process.env.REACT_APP_API + '/auth/login/sso';

    return (
        <section className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <h1>Déconnexion réussie</h1>
            <Button
                color="primary"
                size="lg"
                className="d-flex align-items-center"
                href={URL_LOGIN_SSO}
            >
                Reconnexion
            </Button>
        </section>
    )
}

export default Logout;