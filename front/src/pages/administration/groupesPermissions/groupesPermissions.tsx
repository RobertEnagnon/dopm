import {Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap";
import React, {ChangeEvent, useState} from "react";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePermission} from "../../../hooks/Right/permission";
import {useGroup} from "../../../hooks/Right/group";
import {Group} from "../../../models/Right/group";
import "./groupesPermissions.scss"

const RightGroupesPermissions = () => {
  const { groupes, addPermission, deletePermission } = useGroup();
  const { permissions } = usePermission();
  const [selectedGroup, setSelectedGroup] = useState<Group>();

  const selectGroup = (groupId: number) => {
    setSelectedGroup(groupes?.find(group => group.id === groupId))
  }

  const handleChangePermission = (e: ChangeEvent, idPermission: number) => {
    const isChecked = (e.target as HTMLInputElement).checked
    if (selectedGroup)
    {
      if (isChecked) {
        addPermission(selectedGroup.id, idPermission)
      } else {
        deletePermission(selectedGroup.id, idPermission)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <Row>
          <Col>
            <CardTitle tag='h5'>Permissions</CardTitle>
            <h6 className="card-subtitle text-muted">
              Gestion des <code>permissions</code> des <code>groupes</code>.
            </h6>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md={4}>
            {
              groupes?.map(group => (
                <div key={group.id} className={`groupe-card ${selectedGroup?.id === group.id ? 'active' : ''}`} onClick={() => selectGroup(group.id)}>
                  <FontAwesomeIcon
                    icon={faUser}
                    fixedWidth
                    className="mr-2 align-middle"
                  />
                  {group.name}
                </div>
              ))
            }
          </Col>
          <Col md={8}>
            {
              selectedGroup
              && permissions?.map(permission => (
                <div key={permission.id}>
                  <input type="checkbox" checked={Boolean(selectedGroup.rightsGroupesPermissions.find(rgp => rgp.idPermission === permission.id))} onChange={(e) => {
                    handleChangePermission(e, permission.id)
                  }} />
                  {' '}
                  {' '}
                  {permission.name}
                </div>
              ))
            }
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default RightGroupesPermissions;
