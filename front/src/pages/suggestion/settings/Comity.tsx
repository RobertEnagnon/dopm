import { useState, useEffect } from "react";
import { Alert, Button, Col, FormGroup, Input, Row } from "reactstrap";

import { useSuggestion } from "../../../hooks/suggestion";
import { useUser as useUsers } from "../../../hooks/user";

export const Comity = () => {
  const { users } = useUsers();
  const { OnAddComityUser, OnEditComityUser } = useSuggestion();

  const [userId, setUserId] = useState<number>(0);
  const [error, setError] = useState<string | undefined>(undefined);

  const selectedUser = users?.find((user) => user.isComityUser === true);

  const onValueChange = (value: string) => {
    setUserId(parseInt(value));
    setError(undefined);
  };

  const handleSubmit = async () => {
    if (userId === 0) {
      setError("Vous devez choisir un utilisateur");
    } else {
      if (selectedUser) {
        await OnEditComityUser(userId);
      } else {
        await OnAddComityUser(userId);
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setUserId(selectedUser?.id);
    }
  }, [selectedUser]);

  return (
    <>
      <Row>
        <FormGroup>
          <Col md={2}>
            <label htmlFor="user" className="label">
              Utilisateurs
            </label>
            <Input
              type="select"
              style={{ backgroundColor: "white", padding: 5, marginLeft: 5 }}
              onChange={(event) => onValueChange(event.target.value)}
              value={users?.find((user) => user.id === userId)?.id}
            >
              <option value={0}>Select user</option>
              {users &&
                users.map((user) => {
                  return (
                    <option value={user.id} key={user.id}>
                      {user.firstname} {user.lastname}
                    </option>
                  );
                })}
            </Input>
            {error && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {error}
              </Alert>
            )}
          </Col>
        </FormGroup>
      </Row>
      <Button color="primary" style={{ padding: 5 }} onClick={handleSubmit}>
        Enregistrer
      </Button>
    </>
  );
};
