import { Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown, } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Indicator, IndicatorMode } from "../../../models/Top5/indicator";

import "./IndicatorForm.scss";

interface TitleRowProps {
  indicator: Indicator | undefined;
  indicatorMode: number,
  setIndicatorMode: Function;
}

export const TitleRow = ({
  indicator,
  indicatorMode,
  setIndicatorMode,
}: TitleRowProps) => {
  const INDICATOR_MODES = [
    { title: 'Indicateur journalier', indicatorMode: IndicatorMode.Daily },
    { title: 'Indicateur hebdomadaire', indicatorMode: IndicatorMode.Weekly },
    { title: 'Indicateur mensuel', indicatorMode: IndicatorMode.Monthly },
    { title: 'Indicateur PDF', indicatorMode: IndicatorMode.PDF },
    { title: 'Indicateur Fichier', indicatorMode: IndicatorMode.File },
    { title: 'Indicateur Module', indicatorMode: IndicatorMode.Module },
  ]
  return (
    <>
      <Row className="indicator-title">
        <Col md={8}>
          <h3>{indicator ? indicator.name : "Ajout Indicateur"}</h3>
        </Col>
        <Col className="indicator-title-mode" md={4}>
          <UncontrolledDropdown>
              <DropdownToggle nav>
                <FontAwesomeIcon
                  color="primary"
                  icon={faEllipsis}
                  className="ellipsis-style"
                />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-right">
                {INDICATOR_MODES.map(mode => {
                  return (
                    <DropdownItem key={mode.title}>
                      <div className='mode-container'>
                          <div className="blue-text" onClick={() => {setIndicatorMode(mode.indicatorMode)}}>
                            {indicatorMode === mode.indicatorMode && <div className="active-mode"/>}
                          </div>
                          <div onClick={() => {setIndicatorMode(mode.indicatorMode)}}>
                            {mode.title}
                          </div>
                      </div>
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
        </Col>
      </Row>
    </>
  );
};
