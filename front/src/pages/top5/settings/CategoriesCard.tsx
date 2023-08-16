import { Category } from "../../../models/Top5/category";
import {Button, Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";

import "./Settings.scss";
import { Top5ContextType } from "../../../components/context/top5.context";
import {  useUser  } from "../../../components/context/user.context";
import {  permissionsList  } from "../../../models/Right/permission";
import Reglage from "./Reglage";
import { Switch } from "@mui/material";
import React from "react";

interface CategoriesCardProps {
  top5Context: Top5ContextType;
  setCategoryOnDeletion: Function;
  setCategoryOnCreation: Function;
  setExtractionInProgress: Function;
  setIsArchived: Function;
  isArchived: boolean;
}

export const CategoriesCard = ({
  top5Context,
  setCategoryOnDeletion,
  setCategoryOnCreation,
  setExtractionInProgress,
  setIsArchived,
  isArchived,
}: CategoriesCardProps) => {
  const userContext = useUser();
  return (
    <Card>
      <CardHeader tag="h5">
        <Row>
          <Col md={2}>Catégories</Col>
          <Col md={10} className="d-flex justify-content-end">
            <Switch
              checked={isArchived}
              onChange={() => setIsArchived(!isArchived)}
              title="Afficher les archives"
              color={isArchived ? "success" : "default"}
            />
            <FontAwesomeIcon
              color={isArchived ? "#28a745" : "grey"}
              style={{
                fontSize: "1.5em",
                margin: "0.3em 0.4em 0 0",
              }}
              icon={faArchive}
              className="align-middle"
              onClick={() => {
                setIsArchived(!isArchived);
              }}
              title="Afficher les archives"
            />
            <Reglage />
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row className="mb-1">
          {top5Context.categories
            .filter((c) =>
              userContext.checkAccess(
                permissionsList.parametrageTop5,
                top5Context.currentBranch.id,
                c.id
              )
            )
            .map((category: Category, index: number) => {
              return (
                <Col key={`cat-${category.id}`} className="mr-2 ml-2">
                  <Row style={{ alignItems: "center" }}>
                    {index !== 0 && (
                      <div style={{ width: 15 }}>
                        <FontAwesomeIcon
                          color="primary"
                          icon={faChevronLeft}
                          className="arrow-style-sm"
                          onClick={() =>
                            top5Context.handleCategoryOrder(category, false)
                          }
                        />
                      </div>
                    )}
                    <Col>
                      <Button
                        block
                        outline={
                          category.id !== top5Context.selectedCategory?.id
                        }
                        className="btn"
                        color="primary"
                        onClick={() =>
                          top5Context.setSelectedCategory(category)
                        }
                      >
                        {category.name}
                      </Button>
                    </Col>
                    {index !== top5Context.categories.length - 1 && (
                      <div style={{ width: 15 }}>
                        <FontAwesomeIcon
                          color="primary"
                          icon={faChevronRight}
                          className="arrow-style-sm"
                          onClick={() =>
                            top5Context.handleCategoryOrder(category, true)
                          }
                        />
                      </div>
                    )}
                  </Row>
                </Col>
              );
            })}
        </Row>
        <Row>
          <Col md="1">
            <Button
              color="link"
              className="align-middle"
              style={{ fontSize: "0.8em" }}
              onClick={() => setExtractionInProgress(true)}
            >
              Extraction
            </Button>
          </Col>
          <Col md={{ size: 1, offset: 10 }}>
            <Row>
              {top5Context.categories.length > 0 &&
                top5Context.selectedCategory && (
                  <Col>
                    <Button
                      block
                      color="danger"
                      onClick={() => setCategoryOnDeletion(true)}
                    >
                      -
                    </Button>
                  </Col>
                )}
              {top5Context.categories.length < 9 && (
                <Col>
                  <Button
                    block
                    color="success"
                    onClick={() => setCategoryOnCreation(true)}
                  >
                    +
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
