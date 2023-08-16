import { Link } from "react-router-dom";
import Layout from '../layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row
} from "reactstrap";

import Header from "../../components/layout/header";
import HeaderTitle from "../../components/layout/headerTitle";

const Introduction = () => {

  return (

    <Card>
      <CardHeader>
        <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
          Introduction
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div id="introduction">
          <p style={{ fontSize: '1em' }} >
            L'outil Fiche Sécurité est un outil de suivi de la sécurité simple et efficace.<br />
            Cet outil à été créé dans le but de remonter facilement les écart sécurité du quotidien jusqu'au management de manière digital pour agir plus rapidement.<br />
            En remontant toutes les alertes sécurité du terrain, nous allons améliorer la réactivité, réduire le risque et le nombre d'accidents.<br />
            Plus de pertes d'information, un gain de temps, un suivi plus simple et une meilleure réactivité face aux dérives<br />
          </p>
          <img src={require('../../assets/img/documentations/creationFS.webp')} className="img-fluid" />


        </div>
      </CardBody>
    </Card>
  )
};




const QuickStart = () => (
  <Card>
    <CardHeader>
      <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
        Utilisation
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div >
        <h5 style={{ textDecoration: 'underline' }}>Création d'une fiche de sécurité:</h5>
        <p style={{ fontSize: '1em' }}>
          Une fois les indicateurs paramétrés, nous allons pouvoir alimenter nos indicateurs en se rendant dans la partie <code>DonnéesTop5</code> de la branche en question.<br />
          Une fois dans cette page, il faut sélectionner une catégorie, la date à laquelle vous souhaiter ajouter la donnée et remplir les indicateurs affichés en dessous.<br />
          Enfin, il suffit de valider pour que les données soit ajoutées.<br />
          Vous pouvez répéter cette opération pour chaque catégorie et chaque date que vous souhaitez remplir.
        </p>
        <img src={require('../../assets/img/documentations/creationFS.webp')} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '2%' }}>Statistiques:</h5>
        <p style={{ fontSize: '1em' }}>
          Une fois les indicateurs paramétrés, nous allons pouvoir alimenter nos indicateurs en se rendant dans la partie <code>HistoriqueTop5</code> de la branche en question.<br />
          Une fois dans cette page, il faut sélectionner une catégorie, l'année en haut à droite à laquelle vous voulez ajouter les données et remplir les indicateurs affichés en dessous.<br />
          Enfin, il suffit de valider pour que les données soit ajoutées.<br />
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Information: l'affichage des historiques se fait sur 12mois glissant donc lorsque nous sommes en décembre 2021, vous verrez d'affiché le mois de décembre 2020 dans le graphique historique de gauche. </p>
        </p>
        <img src={require('../../assets/img/documentations/statistiquesFS.webp')} className="img-fluid" />

      </div>
    </CardBody>
  </Card>
);




const Contents = () => (
  <Card>
    <CardHeader>
      <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
        Structure
      </CardTitle>
    </CardHeader>
    <CardBody>
      <Row >
        <p style={{ paddingLeft: '1.1vh' }} className="mb-0">
          Vous avez la possibilité d'avoir plusieurs branches différentes avec, dans chacune d'entre elles des catégories et indicateurs différents.
        </p>
      </Row>
      <Row>
        <Col lg="6">
          <img src={require('../../assets/img/documentations/menu.webp')} style={{ padding: '15px', height: '95%', marginLeft: '20%' }} className="img-fluid" />
        </Col>
        <Col lg="6" style={{ paddingTop: '4vh' }}>

        </Col>
      </Row>
    </CardBody>
  </Card>
);

const Composants = () => (
  <Card>
    <CardHeader>
      <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
        Contenu
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div id="contents">
        <h5 style={{ textDecoration: 'underline' }}>Menu:</h5>
        <p>
          Le menu de Fiche Sécurité se présente sous la forme de 4 icônes.
        </p>
        <img src={require('../../assets/img/documentations/menuTop5.webp')} style={{ height: '90%', marginLeft: '0%' }} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '3%' }}>Catégorie:</h5>
        <p style={{ marginTop: '2%' }}>
          Les catégories sont présente dans chaque branche pour découper les indicateurs en différents services ou fonctions.<br />
          La couleur du bouton catégorie dépend de la couleur du premier indicateur de celle-ci.
        </p>
        <img src={require('../../assets/img/documentations/category.webp')} style={{}} className="img-fluid" />

      </div>
    </CardBody>
  </Card>
);

const Paramétrage = () => {

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
          Paramétrage
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div >
          <p style={{ fontSize: '1em' }}>
            Pour créer et paramétrer des catégories ainsi que les indicateurs associés dans chaque branche, il faut vous rendre dans le menu <code>ParamètresTop5</code>.<br />
            Une fois dans cette page de paramétrage, vous pouvez créer jusqu'a 9 catégories et 8 indicateurs par catégorie.<br />
            <img src={require('../../assets/img/documentations/settingsFS.webp')} className="img-fluid" />
            Sélectionnez ensuite une catégorie et ajouté vos indicateurs.
            Pour chaque indicateur, il faudra lui donner un nom, un responsable, une unité et une logique de lecture.
            La lecture va permettre d'indiquer à votre indicateur quel date il doit regarder pour déterminer la couleur du bouton en fonction de la Target.<br />
            Ensuite vous pouvez ajouter jusqu'à 3 courbes/histogrammes/histo empilé et selectionner une couleur différente pour chacun.<br />
            Vous pouvez ajouer jusqu'à 3 Target en selectionnant le type de target, l'objectif et la valeur de l'objectif.<br /><br />
            <p style={{ color: 'gray', fontStyle: 'italic' }}>Comprendre l'exemple: L'indicateur ATAA est configuré en Target Max à 2, c'est à dire que le maximum est 2.
              <br /> Donc si la donnée dépasse la target qui est à 2, l'indicateur va devenir rouge. La lecture déterminera le jour à lire pour déterminer la couleur.</p>

            Une fois votre indicateur paramétré, il suffit de valider pour engistrer.
            <p style={{ color: 'gray', fontStyle: 'italic' }}>Afficher cumulé: Cette coche est disponible seulement lorsque qu'on créé des histogrammes empilés. Cela vous permettra de simplifier la lecture de l'indicateur en affichant la somme au dessus des histogrammes.</p>
          </p>


        </div>
      </CardBody>
    </Card>
  )
};

const Documentation = () => {
  return (
    <Layout>

      <Container fluid>
        <Header>
          <HeaderTitle>Documentation Fiche Sécurité</HeaderTitle>

          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Documentation</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Fiche Sécurité</BreadcrumbItem>
          </Breadcrumb>
        </Header>

        <Row>
          <Col lg="6">
            <Introduction />
            <QuickStart />
            <Paramétrage />
          </Col>
          <Col lg="6">
            <Contents />
            <Composants />
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}


export default Documentation;
