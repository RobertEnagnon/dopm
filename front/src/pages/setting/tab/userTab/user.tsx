import React, { useEffect, useState } from "react";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";
import {
  CreateUser,
  GetLanguages,
  GetUsers,
  DeleteUser,
  UpdateUser,
} from "../../../../services/user";
import { Button, Col, Row, Table } from "reactstrap";
import Modal from "../../../../components/layout/modal";
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Language, UserData } from "../../../../models/user";
import {
  faExclamationCircle,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import "./user.scss";
import { useService } from "../../../../hooks/service";
// import { useTranslation } from "react-i18next";
// import { Languages } from "../../../../services/enums/Language";

// eslint-disable-next-line no-undef
const IMAGE_URL = process.env.REACT_APP_PUBLIC_URL;
import DefaultAvatar from "../../../../assets/img/avatars/avatar.webp";
import moment from "moment";

const UsersTab = () => {
  const { services } = useService();
  const [users, setUsers] = useState<Array<UserData>>([]);
  const [isCreationOpen, setIsCreationOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<number>(-1);
  const [AllLanguages, setAllLanguages] = useState<Language[]>([]);

  const user = users.filter((el) => el.id === selectedUser)[0];
  // const { i18n } = useTranslation();
  // const [setLang] = useState<Language>(i18n.language as Languages);
  const onEdit = (user: number) => {
    setIsUpdateOpen(true);
    setSelectedUser(user);
  };

  const onDelete = (user: number) => {
    setIsDeleteOpen(true);
    setSelectedUser(user);
  };

  const onCreate = () => {
    setIsCreationOpen(true);
  };

  const onClose = () => {
    setIsUpdateOpen(false);
    setIsCreationOpen(false);
  };

  /* Get users and update state */
  useEffect(() => {
        const sortUsers = (array: Array<UserData>) => {
            return array.sort((a, b) => {
                if (a.lastname?.trim()?.toLowerCase() < b.lastname?.trim()?.toLowerCase()) {
                    return -1;
                } else if (a.lastname?.trim()?.toLowerCase() > b.lastname?.trim()?.toLowerCase()) {
                    return 1;
                } else if (a.firstname?.trim()?.toLowerCase() < b.firstname?.trim()?.toLowerCase()) {
                    return -1;
                } else if (a.firstname?.trim()?.toLowerCase() > b.firstname?.trim()?.toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }

    GetUsers().then((res) => {
        console.log("getUsers - before setUsers", users);
        setUsers(sortUsers(res));
        console.log("getUsers - after setUsers", users);
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            const element = res[key];
            const u = JSON.parse(localStorage.getItem("user") || "");
            if (element.id == u.id) {
              for (const key in AllLanguages) {
                if (Object.prototype.hasOwnProperty.call(AllLanguages, key)) {
                  const language = AllLanguages[key];
                  const ln = Object(element.language.valueOf());
                  const curLanguage = ln.languageId;
                  if (curLanguage === language.id) {
                    localStorage.setItem("lang", language.name);
                  }
                }
              }
            }
          }
        }
    });
  }, [isCreationOpen, isUpdateOpen]);

  useEffect(() => {
    GetLanguages().then((res) => {
      setAllLanguages(res);
    });
  }, []);

  /* Add a new user */
  const HandleAddUser = async (user: UserData) => {
    const userToAdd = {
      ...user,
      service: services.find(
        (service) => +(user?.service?.id || 0) === service.id
      ),
    };
    const res = await CreateUser(userToAdd);
    if (res?.data && res?.data?.user) {
      let newUser = res.data.user;
      setUsers(
        users.concat({
          ...newUser,
          firstname: newUser.first_name,
          lastname: newUser.last_name,
          function: newUser.fonction,
          language: newUser.language,
        })
      );
      notify(
        `L'utilisateur ${newUser.first_name} a été créé.`,
        NotifyActions.Successful
      );
    } else {
      notify("Échec d'ajout de l'utilisateur.", NotifyActions.Error);
    }
    setIsCreationOpen(false);
  };

  /* Edit a new user */
  const HandleEditUser = async (user: UserData) => {
    const userLastState = {
      ...user,
      id: selectedUser,
      service: services.find(
        (service) => +(user?.service?.id || 0) === service.id
      ),
    };
    const res = await UpdateUser(userLastState);
    if (res?.data) {
      setUsers(
        users.map((el) => (el.id === selectedUser ? userLastState : el))
      );
      notify(
        `L'utilisateur ${user.firstname} a été modifié.`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de modification de l'utilisateur.", NotifyActions.Error);
    }
    setIsUpdateOpen(false);
  };

  /* Delete a new user */
  const HandleDeleteUser = async (userId: number) => {
    const res = await DeleteUser(userId);
    if (res?.data) {
      setUsers(users.filter((el) => el.id !== userId));
      notify(
        `L'utilisateur ${user?.firstname} a été supprimé.`,
        NotifyActions.Successful
      );
    } else {
      notify("Échec de suppression de l'utilisateur.", NotifyActions.Error);
    }
    setIsDeleteOpen(false);
  };

  //console.log('areAvatarLoaded', areAvatarLoaded)
  console.log("render -", users);
  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>utilisateurs</code>.
          </h6>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
        {isCreationOpen ? null : (
          <Button
            color="success"
            onClick={() => {
              onCreate();
            }}
          >
            +
          </Button>
        )}
        </Col>
      </Row>
      {/* Popup for create an user */}
      <Modal open={isCreationOpen} hide={setIsCreationOpen} size="lg">
        {/* TODO: Form for create an user */}
        <CreateUserModal
          onSave={HandleAddUser}
          onClose={onClose}
          languages={AllLanguages}
          services={services}
        />
      </Modal>

      {/* Popup for update an user */}
      <Modal open={isUpdateOpen} hide={setIsUpdateOpen} size="lg">
        {/* TODO: Form for update an user */}
        <UpdateUserModal
          currentUserData={user}
          onSave={HandleEditUser}
          onClose={onClose}
          languages={AllLanguages}
          services={services}
        />
      </Modal>

      {/* Popup for delete an user */}
      <Modal open={isDeleteOpen} hide={setIsDeleteOpen} size="sm">
        {/* TODO: Confirmation for delete an user */}
        <div className="popup-main">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            fixedWidth
            size="8x"
            color="red"
            className="align-middle"
          />
          <h3>
            Êtes-vous sûr de vouloir supprimer {user?.firstname}{" "}
            {user?.lastname}
          </h3>
          <div className="actions">
            <Button
              color="primary"
              size="lg"
              onClick={() => setIsDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              color="danger"
              size="lg"
              onClick={() => HandleDeleteUser(selectedUser)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      <Row>
        <Col md={12}>
          <Table striped hover>
            <thead>
              <tr>
                <th></th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Date de création</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr key={index}>
                    <td className="d-flex flex-row justify-content-center align-items-center">
                      <img
                        src={
                          user.url ? `${IMAGE_URL}${user.url}` : DefaultAvatar
                        }
                        width="48"
                        height="48"
                        className="rounded-circle mr-2"
                        alt="Avatar"
                        onError={(event: any) =>
                          (event.target.src = DefaultAvatar)
                        }
                      />
                    </td>
                    <td>{user.lastname?.toUpperCase()}</td>
                    <td>
                      {user.firstname && (
                        <>
                          {user.firstname[0].toUpperCase()}
                          {user.firstname.slice(1)?.toLowerCase()}
                        </>
                      )}
                    </td>
                    <td>{user.email?.toLowerCase()}</td>
                    <td>
                      {moment(
                        typeof user.createdAt === "string"
                          ? new Date(user.createdAt)
                          : user.createdAt,
                        "DD-MM-YYYY"
                      ).format("DD-MM-YYYY")}
                    </td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <FontAwesomeIcon
                          icon={faPen}
                          fixedWidth
                          className="align-middle mr-3 button"
                          onClick={() => {
                            onEdit(user.id);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="align-middle button"
                          onClick={() => {
                            onDelete(user.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default UsersTab;
