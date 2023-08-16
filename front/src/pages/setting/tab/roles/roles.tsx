import React, { ChangeEvent, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from "reactstrap";
import { useUser } from "../../../../hooks/user";
import DefaultAvatar from "../../../../assets/img/avatars/avatar.webp";
import "./roles.scss";
import { UserData } from "../../../../models/user";
import { useGroup } from "../../../../hooks/Right/group";
import { Group } from "../../../../models/Right/group";
import { usePermission } from "../../../../hooks/Right/permission";
import { useBranch } from "../../../../hooks/Top5/branch";
import { useCategories } from "../../../../hooks/Top5/category";
import { Category } from "../../../../models/Top5/category";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { permissionsList } from "../../../../models/Right/permission";
import { useDashboard } from "../../../../hooks/dashboard";

// eslint-disable-next-line no-undef
const IMAGE_URL = process.env.REACT_APP_PUBLIC_URL;

const RolesTab = () => {
  const [selectedUser, setSelectedUser] = useState<number>();
  const {
    users,
    addUserGroup,
    deleteUserGroup,
    addSpecificPermission,
    deleteSpecificPermission,
    updateResponsible,
  } = useUser();

  return (
    <>
      <Row className="mt-4 mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>utilisateurs</code>.
          </h6>
        </Col>
      </Row>
      <Row>
        <Col md={4} style={{ maxHeight: 700, overflow: "auto" }}>
          {users?.map((user) => (
            <div
              key={user.id}
              className={`groupe-card ${
                selectedUser === user.id ? "active" : ""
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <img
                src={user.url ? IMAGE_URL + user.url : DefaultAvatar}
                width="48"
                height="48"
                className="rounded-circle mr-2"
                onError={(event: any) => (event.target.src = DefaultAvatar)}
              />
              {user.firstname} {user.lastname.toUpperCase()}
            </div>
          ))}
        </Col>
        <Col md={8} style={{ maxHeight: 700, overflow: "auto" }}>
          {users && selectedUser && (
            <UserRolesSection
              user={users.filter((user) => user.id === selectedUser)[0]}
              addUserGroup={addUserGroup}
              deleteUserGroup={deleteUserGroup}
              addSpecificPermission={addSpecificPermission}
              deleteSpecificPermission={deleteSpecificPermission}
              updateResponsible={updateResponsible}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

type UserRoleSectionType = {
  user: UserData;
  addUserGroup: Function;
  deleteUserGroup: Function;
  addSpecificPermission: Function;
  deleteSpecificPermission: Function;
  updateResponsible: Function;
};

const UserRolesSection = ({
  user,
  addUserGroup,
  deleteUserGroup,
  addSpecificPermission,
  deleteSpecificPermission,
  updateResponsible,
}: UserRoleSectionType) => {
  const { groupes } = useGroup();
  const { permissions } = usePermission();
  const { branches, allCategories } = useBranch();
  const [getCategoriesByBranch] = useCategories();
  const { dashboards } = useDashboard();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [selectedPermission, setSelectedPermission] = useState<number>();
  const [selectedBranch, setSelectedBranch] = useState<number>();
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [selectedDashboard, setSelectedDashboard] = useState<number>();
  const top5Permissions = [
    permissionsList.lectureGraphique,
    permissionsList.ajoutDonneesCategorie,
    permissionsList.lectureParametrage,
    permissionsList.parametrageTop5,
  ];
  const dashboardPermissions = [
    permissionsList.lectureDashboard,
    permissionsList.parametrageDashboard,
  ];

  const handleChangeGroup = (e: ChangeEvent, group: Group) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isChecked) {
      addUserGroup(user.id, group);
    } else {
      deleteUserGroup(user.id, group);
    }
  };

  const handleChangeBranch = async (e: ChangeEvent) => {
    const branch = parseInt((e.target as HTMLInputElement).value);
    setSelectedBranch(branch);
    if (branch !== 0) {
      const res = await getCategoriesByBranch(branch);
      setCategories(res.updatedCategories);
    } else {
      setCategories([]);
    }
    setSelectedCategory(0);
  };

  const handleChangeDashboard = async (e: ChangeEvent) => {
    const dashboard = parseInt((e.target as HTMLInputElement).value);
    setSelectedDashboard(dashboard);
  };
  const handleChangeSelect = (e: ChangeEvent) => {
    const element = e.target as HTMLInputElement;
    if (element.name === "permissions") {
      setSelectedPermission(parseInt(element.value));
      setSelectedBranch(0);
      setCategories([]);
    }
    if (element.name === "categories") {
      setSelectedCategory(parseInt(element.value));
    }
  };

  const addCustomPermission = async () => {
    await addSpecificPermission(
      user.id,
      selectedPermission,
      selectedBranch,
      selectedCategory,
      selectedDashboard
    );
    setSelectedCategory(0);
    setSelectedBranch(0);
    setSelectedPermission(0);
    setSelectedDashboard(0);
  };

  const deleteCustomPermission = async (
    userId: number,
    permissionId: number
  ) => {
    await deleteSpecificPermission(userId, permissionId);
  };

  const handleChangeResponsible = async (e: ChangeEvent) => {
    const element = e.target as HTMLInputElement;
    updateResponsible(user, element.checked);
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <CardTitle tag="h5">
                    {user.roles && (
                      <>
                        {user.roles[0].toUpperCase()}
                        {user.roles.slice(1)?.toLowerCase()}
                      </>
                    )}
                  </CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <input
                    type="checkbox"
                    checked={!!user.isResponsible}
                    onChange={handleChangeResponsible}
                  />{" "}
                  Responsable
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <CardTitle tag="h5">Groupes</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                {groupes?.map((group) => (
                  <Col key={group.id}>
                    <input
                      type="checkbox"
                      checked={Boolean(
                        user.groupes.find((g) => g.id_groupe === group.id)
                      )}
                      onChange={(e) => {
                        handleChangeGroup(e, group);
                      }}
                    />{" "}
                    {group.name}
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <CardTitle tag="h5">Droits spécifiques</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Table hover striped className="specificPermissionsArray">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>Branche/ Dashboard</th>
                    <th>Catégorie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {user.permissions?.map((permission) => (
                    <tr key={permission.id}>
                      <td>
                        {
                          permissions?.find(
                            (perm) => perm.id === permission.id_permission
                          )?.name
                        }
                      </td>
                      <td>
                        {dashboardPermissions.includes(permission.id_permission)
                          ? dashboards?.find(
                              (d) => d.id === permission.id_dashboard
                            )?.name || "-"
                          : branches?.find(
                              (branch) => branch.id === permission.id_branch
                            )?.name || "-"}
                      </td>
                      <td>
                        {allCategories?.find(
                          (category) => category.id === permission.id_category
                        )?.name || "-"}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="mr-2 align-middle"
                          onClick={() =>
                            deleteCustomPermission(user.id, permission.id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Row>
                <Col>
                  <select
                    className="form-select"
                    name="permissions"
                    value={selectedPermission}
                    onChange={handleChangeSelect}
                  >
                    <option value="0">Sélectionner une permission</option>
                    {permissions?.map((permission) => (
                      <option key={permission.id} value={permission.id}>
                        {permission.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col>
                  {selectedPermission &&
                  top5Permissions.includes(selectedPermission) ? (
                    <select
                      className="form-select"
                      value={selectedBranch}
                      onChange={handleChangeBranch}
                    >
                      <option value="0">Sélectionner une branche</option>
                      {branches?.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    ""
                  )}
                  {selectedPermission &&
                  dashboardPermissions.includes(selectedPermission) ? (
                    <select
                      className="form-control"
                      value={selectedDashboard}
                      onChange={handleChangeDashboard}
                    >
                      <option value="0">Sélectionner un Dashboard</option>
                      {dashboards?.map((dashboard) => (
                        <option key={dashboard.id} value={dashboard.id}>
                          {dashboard.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    ""
                  )}
                </Col>
                <Col>
                  {categories.length ? (
                    <select
                      className="form-select"
                      name="categories"
                      value={selectedCategory}
                      onChange={handleChangeSelect}
                    >
                      <option value="0">Sélectionner une catégorie</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    ""
                  )}
                </Col>
                <Col>
                  <Button
                    block
                    color="success"
                    disabled={
                      !!user.permissions?.find(
                        (permission) =>
                          permission.id_permission === selectedPermission &&
                          permission.id_branch === selectedBranch &&
                          permission.id_category === selectedCategory
                      )
                    }
                    onClick={addCustomPermission}
                  >
                    Valider
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RolesTab;
