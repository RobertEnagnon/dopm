import { AsTask } from "../../../../../models/Assignation/asTask";
import { Button, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import DefaultAvatar from "../../../../../assets/img/avatars/avatar.webp";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheckSquare,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import moment from "moment";
import { useAssignation } from "../../../../../components/context/assignation.context";
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

type PDCAProps = {
  task: AsTask;
  openModal: Function;
  responsiblesView?: boolean;
  searchView?: boolean;
};

const PDCATask = ({
  task,
  openModal,
  responsiblesView = false,
  searchView = false,
}: PDCAProps) => {
  const { displayMode, displayModes } = useAssignation();
  return (
    <Card
      className={`mt-1 mb-1 bg-light ${searchView ? "" : "cursor-grab"} p-1`}
      style={{
        borderLeft: `5px solid ${task.category?.color}`,
        boxShadow: "0px 4px 12px #afafaf",
        minHeight:
          responsiblesView &&
          [displayModes.week, displayModes.doubleWeeks].includes(displayMode)
            ? 150
            : "initial",
      }}
    >
      <CardHeader
        className="pl-1 pr-1 pb-0 pt-0 bg-light"
        style={{ border: "none" }}
      >
        <CardTitle
          tag="h3"
          className={`mb-0 ${
            responsiblesView || (searchView && "textSplitted")
          }`}
          style={{
            wordBreak: "break-all",
            ...(responsiblesView ? { lineHeight: 1.15 } : {}),
          }}
        >
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardBody
        className={`pl-1 pr-1 pb-1 pt-0 d-flex flex-column justify-content-${
          task.description ? "between" : "end"
        }`}
      >
        {task.description && (
          <div
            className={`text-muted p-0 ${
              responsiblesView || (searchView && "textSplitted")
            }`}
            style={{
              minHeight: 25,
              fontSize: "0.85rem",
              ...(responsiblesView ? { lineHeight: 1.15 } : {}),
            }}
          >
            {task.description}
          </div>
        )}
        <div className={`${!responsiblesView && "d-flex col"} justify-content-between align-items-end pt-2 pr-2 pl-2`}>
          <div
            className={`text-center timePanel ${
              moment(task.estimation).isSameOrAfter(moment())
                ? ""
                : "timePanelDanger"
            }`}
          >
            <FontAwesomeIcon icon={faClock} />
            &nbsp;
            {moment(task.estimation).format("Do MMM YYYY")}
          </div>
          <div
            className="text-muted p-0 text-right"
            hidden={task.checklist.length === 0}
          >
            <FontAwesomeIcon icon={faCheckSquare} />
            &nbsp;
            {`${task.checklist.filter((c) => c.done === 1).length}/${
              task.checklist.length
            }`}
          </div>
          <div
            className="text-muted p-0 text-right"
            hidden={task.files.length === 0}
          >
            <FontAwesomeIcon icon={faPaperclip} />
            &nbsp;
            {task.files.length}
          </div>
          <div className="d-flex">
            {task.responsibles.length > 0 && !responsiblesView && (
              <>
                <img
                  src={`${PUBLIC_URL}/${task.responsibles[0]?.url}`}
                  width="26"
                  height="26"
                  className="rounded-circle imgResponsible"
                  onError={(event) =>
                    ((event.target as HTMLImageElement).src = DefaultAvatar)
                  }
                  alt="Avatar"
                />
                {task.responsibles.length - 1 > 0 && (
                  <span className="nbResponsibles">
                    +{task.responsibles.length - 1}
                  </span>
                )}
              </>
            )}
          </div>
          <div>
            <Button
              className="pl-2 pr-2 pt-0 pb-0 mt-1"
              color="primary"
              onClick={() =>
                openModal(searchView ? "editTask" : "edit", task.id)
              }
            >
              Voir
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PDCATask;
