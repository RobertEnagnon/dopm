import {Col,Row} from "reactstrap";
import AnalyseCard from "./analyseCard";
import StatisticsCard from "./statisticsCard";

export default function Analyse() {
  return (
    <>
      <Row>
        <Col>
          {/* Analyse sur 1 semaine */}
          <AnalyseCard />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Statistiques */}
          <StatisticsCard />
        </Col>
      </Row>
    </>
  );
}
