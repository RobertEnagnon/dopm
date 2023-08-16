import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Col, Row } from "reactstrap";

import { useTop5 } from "../../../components/context/top5.context";
import { useIndicator } from "../../../hooks/Top5/indicator";

import { defaultCategory } from "../../../models/Top5/category";
import { Indicator } from "../../../models/Top5/indicator";
import ModalComponent from "../../../components/layout/modal";
import { ConfirmationModal } from "../../../components/common/ConfirmationModal";

import CategoryForm from "../../../components/top5/categoryForm";
import IndicatorForm from "../../../components/top5/indicatorForm/IndicatorForm";

import { CategoriesCard } from "./CategoriesCard";
import { IndicatorCard } from "./IndicatorCard";

import "./Settings.scss";
import Extraction from "../../../components/top5/Extraction/Extraction";

const Settings = () => {
  const [categoryOnCreation, setCategoryOnCreation] = useState<boolean>(false);
  const [categoryOnDeletion, setCategoryOnDeletion] = useState<boolean>(false);
  const [extractionInProgress, setExtractionInProgress] =
    useState<boolean>(false);
  const [indicatorOnCreation, setIndicatorOnCreation] =
    useState<boolean>(false);
  const [indicatorOnEdition, setIndicatorOnEdition] = useState<boolean>(false);
  const [indicatorOnDeletion, setIndicatorOnDeletion] =
    useState<boolean>(false);

  const [isArchived, setIsArchived] = useState<boolean>(false);

  const top5Context = useTop5();
  const indicatorHook = useIndicator({
    category: top5Context.selectedCategory,
    isArchived: isArchived,
  });

  const confirmCategoryDelete = async () => {
    await top5Context.handleDeleteCategory(top5Context.selectedCategory);
    setCategoryOnDeletion(false);
  };

  {
    console.log("indicators:", indicatorHook.indicators);
  }

  return (
    <div>
      {/**L'element parent a deja le toasContainer plus besoin */}
      <ModalComponent
        open={categoryOnCreation}
        hide={() => setCategoryOnCreation(false)}
      >
        <CategoryForm
          category={defaultCategory}
          top5Context={top5Context}
          setCategoryOnCreation={setCategoryOnCreation}
        />
      </ModalComponent>

      <ModalComponent
        open={extractionInProgress}
        hide={() => setExtractionInProgress(false)}
      >
        <Extraction />
      </ModalComponent>

      <ModalComponent
        open={indicatorOnCreation}
        hide={() => setIndicatorOnCreation(false)}
      >
        <Modal.Body>
          <IndicatorForm
            indicatorHook={indicatorHook}
            setIndicatorOnCreation={setIndicatorOnCreation}
          />
        </Modal.Body>
      </ModalComponent>

      <ModalComponent
        open={indicatorOnEdition}
        hide={() => setIndicatorOnEdition(false)}
      >
        <Modal.Body style={{ marginLeft: 30, marginRight: 20 }}>
          <IndicatorForm
            indicatorHook={indicatorHook}
            setIndicatorOnEdition={setIndicatorOnEdition}
          />
        </Modal.Body>
      </ModalComponent>

      <ConfirmationModal
        open={categoryOnDeletion}
        title="Suppression catégorie"
        description={"Étes-vous sûr de supprimer la catégorie ?"}
        hide={() => setCategoryOnDeletion(false)}
        confirm={confirmCategoryDelete}
      />
      <Row>
        <Col md={12}>
          <CategoriesCard
            top5Context={top5Context}
            setCategoryOnDeletion={setCategoryOnDeletion}
            setCategoryOnCreation={setCategoryOnCreation}
            setExtractionInProgress={setExtractionInProgress}
            setIsArchived={setIsArchived}
            isArchived={isArchived}
          />
        </Col>
      </Row>
      {indicatorHook.indicators?.map((indicator: Indicator, index: number) => {
        return (
          <Row key={`ind-${index}`}>
            <Col md={{ size: 10, offset: 1 }}>
              <IndicatorCard
                indicator={indicator}
                index={index}
                indicatorHook={indicatorHook}
                setIndicatorOnEdition={setIndicatorOnEdition}
                indicatorOnDeletion={indicatorOnDeletion}
                setIndicatorOnDeletion={setIndicatorOnDeletion}
                archivedIndicators={isArchived}
              />
            </Col>
          </Row>
        );
      })}
      {top5Context.selectedCategory && !indicatorOnCreation && !isArchived ? (
        <Row>
          <Col md={{ size: 4, offset: 5 }}>
            <Button
              style={{ marginTop: "10px" }}
              color="success"
              onClick={() => {
                indicatorHook.setSelectedIndicator(undefined);
                setIndicatorOnCreation(true);
              }}
              size="lg"
            >
              Ajouter un Indicateur
            </Button>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};

export default Settings;
