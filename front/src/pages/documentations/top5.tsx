import React from "react";
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

const Introduction = () => (
  <Card>
    <CardHeader>
      <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
        Introduction
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div id="introduction">
        <p style={{ fontSize: '1em' }} >
          L'outil Top 5 est un outil de suivi d'indicateurs épuré et facile d'utilisation.<br />
          Cet outil digital est essentiel et vous permettra d'améliorer votre suivi au quotidien.<br />
          Plus de perte de temps, diminution des fichiers excel et une meilleure réactivité face aux dérives.<br />
          La plus grande difficulté n'est pas l'utilisation de l'outil mais la pertinence des indicateurs qui seront suivis et les routines associées.
        </p>
        <img src={require('../../assets/img/documentations/top5.webp')} className="img-fluid" />


      </div>
    </CardBody>
  </Card>
);

const QuickStart = () => (
  <Card>
    <CardHeader>
      <CardTitle tag="h5" style={{ fontSize: '1.2em' }} className="mb-0">
        Utilisation
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div >
        <h5 style={{ textDecoration: 'underline' }}>Ajout de données dans un indicateur:</h5>
        <p style={{ fontSize: '1em' }}>
          Une fois les indicateurs paramétrés, nous allons pouvoir alimenter nos indicateurs en se rendant dans la partie <code>DonnéesTop5</code> de la branche en question.<br />
          Une fois sur cette page, il faut sélectionner une catégorie, la date à laquelle vous souhaitez ajouter la donnée et remplir les indicateurs affichés en dessous.<br />
          Enfin, il suffit de valider pour que les données soient ajoutées.<br />
          Vous pouvez répéter cette opération pour chaque catégorie et pour chaque date que vous souhaitez remplir.
        </p>
        <img src={require('../../assets/img/documentations/data.webp')} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '2%' }}>Ajout d'historique dans un indicateur:</h5>
        <p style={{ fontSize: '1em' }}>
          Une fois les indicateurs paramétrés, nous allons pouvoir alimenter nos indicateurs en se rendant dans la partie <code>HistoriqueTop5</code> de la branche en question.<br />
          Une fois sur cette page, il faut sélectionner une catégorie, l'année en haut à droite à laquelle vous voulez ajouter les données et remplir les indicateurs affichés en dessous.<br />
          Enfin, il suffit de valider pour que les données soient ajoutées.<br />
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Information: l'affichage des historiques se fait sur 12mois glissants donc lorsque nous sommes en décembre 2021, vous verrez affiché le mois de décembre 2020 dans le graphique historique de gauche. </p>
        </p>
        <img src={require('../../assets/img/documentations/history.webp')} className="img-fluid" />

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
          Vous avez la possibilité d'avoir plusieurs branches différentes avec, dans chacune d'entre elles, des catégories et indicateurs différents.
        </p>
      </Row>
      <Row>
        <Col lg="6">
          <img src={require('../../assets/img/documentations/menu.webp')} style={{ padding: '15px', height: '95%', marginLeft: '20%' }} className="img-fluid" />
        </Col>
        <Col lg="6" style={{ paddingTop: '4vh' }}>
          <pre className="snippet">{`
  Top 5
     └──Branche 1  
        └──  Paramètres
                │
             Catégories
                ├── Nom Catégorie
             Indicateurs
                ├── Nom Indicateur
                ├── Responsable
                ├── Unité
                ├── Lecture (J-1/J/J+1)
                ├── Courbes
                │    ├── Type (Histogramme/Courbe)
                │    └── Couleur
                └── Targets
                     ├── Type (Horizontal/vertical)
                     ├── Objectif (Target Min/Target Max)
                     └── Couleur
     └──Branche 2
     └──Branche ...
      `}</pre>
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
          Le menu de Top 5 se présente sous la forme de 4 icônes.
        </p>
        <img src={require('../../assets/img/documentations/menuTop5.webp')} style={{ height: '90%', marginLeft: '0%' }} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '3%' }}>Catégories:</h5>
        <p style={{ marginTop: '2%' }}>
          Les catégories sont présentes dans chaque branche pour découper les indicateurs en différents services ou fonctions.<br />
          La couleur du bouton catégorie dépend de la couleur du premier indicateur de celle-ci.
        </p>
        <img src={require('../../assets/img/documentations/category.webp')} style={{}} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '3%' }}>Indicateurs:</h5>
        <p style={{ marginTop: '2%' }}>
          Les indicateurs sont listés sous forme de bouton sur la partie gauche de Top5.<br />
        </p>
        <img src={require('../../assets/img/documentations/indicators.webp')} style={{ height: '95%' }} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '3%' }}>Graphique:</h5>
        <p style={{ marginTop: '2%' }}>
          A chaque clique sur un bouton d'indicateur, les graphiques historique et mois en cours se mettent à jour.
          La couleur de ces boutons dépend de la valeur renseignée à J-1/J/J+1 en fonction de la target renseignée (Voir paramètres).
        </p>
        <img src={require('../../assets/img/documentations/chartHistoMonthly.webp')} style={{ height: '95%' }} className="img-fluid" />
        <h5 style={{ textDecoration: 'underline', marginTop: '3%' }}>Commentaires, Unité, Responsable:</h5>
        <p style={{ marginTop: '2%' }}>
          Les commentaires, l'unité et le responsable sont affichés en bas pour faciliter la compréhension des indicateurs.
        </p>
        <img src={require('../../assets/img/documentations/commentRespUnity.webp')} style={{ height: '95%' }} className="img-fluid" />
      </div>
    </CardBody>
  </Card>
);

const Paramétrage = () => (
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
          Une fois dans cette page de paramétrage, vous pouvez créer jusqu'à 9 catégories et 8 indicateurs par catégorie.<br />
          <img src={require('../../assets/img/documentations/settings.webp')} className="img-fluid" />
          Sélectionnez ensuite une catégorie et ajoutez vos indicateurs.
          Pour chaque indicateur, il faudra lui donner un nom, un responsable, une unité et une logique de lecture.
          Le paramètre "Lecture" de chaque indicateur va permettre de déterminer la couleur du bouton en fonction de sa Target.<br />
          Ensuite vous pouvez ajouter jusqu'à 3 courbes/histogrammes/histogrammes empilés et sélectionner une couleur différente pour chacun.<br />
          Vous pouvez ajouter jusqu'à 3 Target en sélectionnant le type de target, l'objectif et la valeur de l'objectif.<br /><br />
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Comprendre l'exemple: L'indicateur ATAA est configuré en Target Max à 2, c'est-à-dire que le maximum est 2.
            <br /> Donc si la donnée dépasse la target qui est à 2, l'indicateur va devenir rouge. La lecture déterminera le jour à lire pour déterminer la couleur.</p>
          <img src={require('../../assets/img/documentations/paramsIndicator.webp')} style={{ padding: '5%' }} className="img-fluid" />
          Une fois votre indicateur paramétré, il suffit de valider pour enregistrer.
          <p style={{ color: 'gray', fontStyle: 'italic' }}>Afficher cumulé: Cette coche est disponible seulement lorsque l'on créé des histogrammes empilés. Cela vous permettra de simplifier la lecture de l'indicateur en affichant la somme au-dessus des histogrammes.</p>
        </p>
        <img src={require('../../assets/img/documentations/accumulateDisplay.webp')} style={{ padding: '5%', width: '40%' }} className="img-fluid" />

        <p style={{ fontSize: '1em', textAlign: 'center' }}>
          <br />
          Vidéo en cours de préparation ...<br />
          <code>Vidéo de démonstration</code>
        </p>
      </div>
    </CardBody>
  </Card>
);

const Documentation = () => {
  return (
    <Layout>
      <Container fluid>
        <Header>
          <HeaderTitle>Documentation Top 5</HeaderTitle>

          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Documentation</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Top 5</BreadcrumbItem>
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
