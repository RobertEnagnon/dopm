import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";
import { Col, FormGroup, Input, Row } from "reactstrap";
import { useUser } from "../../../../components/context/user.context";
import { useUser as useUsers } from "../../../../hooks/user";

import { Suggestion } from "../../../../models/suggestion";

const statusArray = [
  {
    name: "Choisir le statut",
    bg: "#efefef",
    color: "black",
    value: undefined,
  },
  {
    name: "Valider",
    bg: "#8bc34a",
    color: "white",
    value: true,
  },
  {
    name: "Refuser",
    bg: "red",
    color: "white",
    value: false,
  },
];

interface StatusRowProps {
  chosenSuggestion: Suggestion;
  setStatusValidated: Dispatch<SetStateAction<boolean | undefined>>;
  setStatusComment: Dispatch<SetStateAction<string | undefined>>;
}

export const SugStatusRow = ({
  chosenSuggestion,
  setStatusValidated,
  setStatusComment,
}: StatusRowProps) => {
  const { currentUser } = useUser();
  const { users } = useUsers();
  const [statusBGColor, setStatusBGColor] = useState("#efefef");
  const [statusColor, setStatusColor] = useState("black");

  const sugWorkflow = chosenSuggestion.statusWorkflow;
  const sugResponsible = chosenSuggestion.responsible;

  const comityUser = users?.find((user) => user.isComityUser === true);
  const isAllowed =
    (!sugWorkflow?.firstValidated && sugResponsible?.id === currentUser.id) ||
    (sugWorkflow?.firstValidated && comityUser?.id === currentUser.id);

  const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = statusArray.find(
      (item) => item.name === event.target.value
    );
    selectedValue && setStatusBGColor(selectedValue.bg);
    selectedValue && setStatusColor(selectedValue.color);
    setStatusValidated(selectedValue?.value);
    setStatusComment(undefined);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setStatusComment(event.target.value);
  };

  return (
    <>
      <label>
        <h3>Traitement</h3>
      </label>
      <Row>
        <Col>
          <label htmlFor="status" className="label">
            Status
          </label>
          <Row>
            <FormGroup>
              <Col>
                <Input
                  type="select"
                  style={{
                    backgroundColor: statusBGColor,
                    color: statusColor,
                  }}
                  onChange={(event) => handleSelectChange(event)}
                  disabled={!isAllowed}
                >
                  {statusArray &&
                    statusArray.map((status) => {
                      return (
                        <option
                          value={status.name}
                          key={status.name}
                          style={{
                            backgroundColor: status.bg,
                            color: status.color,
                          }}
                        >
                          {status.name}
                        </option>
                      );
                    })}
                </Input>
              </Col>
            </FormGroup>
            {(statusBGColor === "#8bc34a" || statusBGColor === "red") && (
              <FormGroup>
                <Col>
                  <Input
                    type="text"
                    id="statusComment"
                    onChange={(event) => handleInput(event)}
                  />
                </Col>
              </FormGroup>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};
