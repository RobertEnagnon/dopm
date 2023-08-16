import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

const ErrorAd = () => {

    const [error, setError] = useState<string>("Aucune erreur");

    const URL_LOGOUT_SSO = process.env.REACT_APP_API + '/auth/logout/sso';

    useEffect(() => {
        //Vérification du retour d'erreur d'une requête SSO
        const queryParams = new URLSearchParams(window.location.search)
        setError(queryParams.get("error") || "");
    })

    return (
        <section className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <h1>Erreur lors de la connexion à l'AD : {error}</h1>
            <h4>Veuillez contacter votre administrateur</h4>
            <Button
                color="primary"
                size="lg"
                className="d-flex align-items-center"
                href={URL_LOGOUT_SSO}
            >
                Déconnexion de l'AD
            </Button>
        </section>
    )
}

export default ErrorAd;