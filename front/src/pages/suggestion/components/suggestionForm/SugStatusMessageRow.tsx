import { Col, Row, FormGroup, Input } from "reactstrap";
import { Dispatch, SetStateAction } from "react";
import { useUser } from "../../../../components/context/user.context";
import { useUser as useUsers } from "../../../../hooks/user";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Suggestion } from "../../../../models/suggestion";

const boxStyle = {
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5,
  padding: 10,
  marginRight: 5,
  marginLeft: 5,
  marginBottom: 5,
  boxShadow: "0px 4px 12px #afafaf",
};
const disabledBoxStyle = {
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5,
  padding: 10,
  marginRight: 10,
  marginBottom: 5,
  backgroundColor: "#e9ecef",
  boxShadow: "0px 4px 12px #afafaf",
};

const arrowStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 5,
};

interface SugStatusMessageRowProps {
  chosenSuggestion: Suggestion;
  setStatusValidatedResponsible: Dispatch<SetStateAction<boolean | undefined>>;
  setStatusValidatedComity: Dispatch<SetStateAction<boolean | undefined>>;
  setCommentResponsible: Dispatch<SetStateAction<string | undefined>>;
  setCommentComity: Dispatch<SetStateAction<string | undefined>>;
  statusResponsible: boolean | undefined;
  statusComity: boolean | undefined;
  commentResponsible: string;
  commentComity: string;
}

const iconsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
};

export const SugStatusMessageRow = ({
  chosenSuggestion,
  setStatusValidatedResponsible,
  setStatusValidatedComity,
  setCommentResponsible,
  setCommentComity,
  statusResponsible,
  statusComity,
  commentResponsible,
  commentComity,
}: SugStatusMessageRowProps) => {
  const { currentUser } = useUser();
  const { users } = useUsers();

  const sugResponsible = chosenSuggestion.responsible;

  const comityUser = users?.find((user) => user.isComityUser === true);

  const isAllowedValidateResponsible =
    sugResponsible?.id === currentUser.id || comityUser?.id === currentUser.id; // Responsable / Comité peut modifier
  const isAllowedValidateComity = comityUser?.id === currentUser.id; // Comité peut modifier

  return (
    <>
      <Row style={isAllowedValidateResponsible ? boxStyle : disabledBoxStyle}>
        <Col>
          Responsable de l'émetteur
          <FormGroup className="mt-2">
            <Input
              disabled={!isAllowedValidateResponsible}
              id="commentResponsible"
              value={commentResponsible || undefined}
                placeholder="Commentaire"
              onChange={(e) => setCommentResponsible(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col style={iconsStyle}>
          <>
            <div className={"radioCheck"}>
              <input
                type="radio"
                id={`ok_statusResponsible`}
                checked={statusResponsible}
                disabled={!isAllowedValidateResponsible}
                onChange={() => {
                  if (isAllowedValidateResponsible)
                    setStatusValidatedResponsible(true);
                }}
              />
              <label htmlFor={`ok_statusResponsible`}>
                <FontAwesomeIcon icon={faCheck} />
              </label>
            </div>
            <div className={"radioCross"}>
              <input
                type="radio"
                id={`nok_statusResponsible`}
                checked={
                  statusResponsible !== undefined
                    ? !statusResponsible
                    : undefined
                } // undefined pour ne pas afficher la croix par défaut
                disabled={!isAllowedValidateResponsible}
                onChange={() => {
                  if (isAllowedValidateResponsible)
                    setStatusValidatedResponsible(false);
                }}
              />
              <label htmlFor={`nok_statusResponsible`}>
                <FontAwesomeIcon icon={faX} />
              </label>
            </div>
          </>
        </Col>
      </Row>
      <Row style={arrowStyle}>
        <ArrowDownwardIcon />
      </Row>
      <Row style={isAllowedValidateComity ? boxStyle : disabledBoxStyle}>
        <Col>
          Comité Suggestion
          <FormGroup className="mt-2">
            <Input
              disabled={!isAllowedValidateComity}
              id="commentComity"
              value={commentComity || undefined}
                placeholder="Commentaire"
              onChange={(e) => setCommentComity(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col style={iconsStyle}>
          <>
            <div className={"radioCheck"}>
              <input
                type="radio"
                id={`ok_statusComity`}
                checked={statusComity}
                disabled={!isAllowedValidateComity}
                onChange={() => {
                  if (isAllowedValidateComity) setStatusValidatedComity(true);
                }}
              />
              <label htmlFor={`ok_statusComity`}>
                <FontAwesomeIcon icon={faCheck} />
              </label>
            </div>
            <div className={"radioCross"}>
              <input
                type="radio"
                id={`nok_statusComity`}
                checked={statusComity !== undefined ? !statusComity : undefined} // undefined pour ne pas afficher la croix par défaut
                disabled={!isAllowedValidateComity}
                onChange={() => {
                  if (isAllowedValidateComity) setStatusValidatedComity(false);
                }}
              />
              <label htmlFor={`nok_statusComity`}>
                <FontAwesomeIcon icon={faX} />
              </label>
            </div>
          </>
        </Col>
      </Row>
    </>
  );
};
