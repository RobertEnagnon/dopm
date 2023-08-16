import React, { useEffect, useState } from "react";
import { Branch } from "../../../models/Top5/branch";
import {
  CreateBranch,
  DeleteBranch,
  GetBranches,
  UpdateBranch,
} from "../../../services/Top5/branch";
import { Button, Col, Row, Table } from "reactstrap";
import Modal from "../../../components/layout/modal";
import { notify, NotifyActions } from "../../../utils/dopm.utils";
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import CreateBranchModal from "./createBranchModal";
import UpdateBranchModal from "./updateBranchModal";
import DeleteBranchModal from "./deleteBranchModal";
import moment from "moment";

const BranchTab = () => {
  const [branches, setBranches] = useState<Array<Branch>>([]);
  const [isCreationOpen, setIsCreationOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<number>(-1);
  const actualBranch: Branch = branches.filter(
    (el) => el.id === selectedBranch
  )[0];
  const [isPending, setIsPending] = useState(false);

  /* Get branches and update state */
  useEffect(() => {
    GetBranches().then((res) => {
      setBranches(res);
    });
  }, []);
  const onEdit = (user: number) => {
    setIsUpdateOpen(true);
    setSelectedBranch(user);
  };

  const onDelete = (user: number) => {
    setIsDeleteOpen(true);
    setSelectedBranch(user);
  };

  const onCreate = () => {
    setIsCreationOpen(true);
  };

  const onClose = () => {
    setIsUpdateOpen(false);
    setIsCreationOpen(false);
    setIsDeleteOpen(false);
  };

  const HandleAddBranch = async (branch: Branch) => {
    setIsPending(true);
    const res = await CreateBranch(branch);
    if (res?.data && res?.data?.branch) {
      let newBanch = res.data.branch;
      setBranches(
        branches.concat({
          ...newBanch,
          name: newBanch.name,
        })
      );
      notify(
        `La branche ${newBanch.name} a été créé.`,
        NotifyActions.Successful
      );
    } else {
      notify("Échec d'ajout de la branche.", NotifyActions.Error);
    }
    setIsPending(false);
    setIsCreationOpen(false);
  };

  const HandleEditBranch = async (branch: Branch) => {
    setIsPending(true);
    const res = await UpdateBranch(actualBranch, branch.name);
    if (res?.data) {
      setBranches(
        branches.map((el) =>
          el.id === selectedBranch
            ? { ...actualBranch, ...branch, id: selectedBranch }
            : el
        )
      );
      notify(
        `La branche ${branch.name} a été modifié.`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de modification de la branche", NotifyActions.Error);
    }
    setIsPending(false);
    setIsUpdateOpen(false);
  };

  const HandleDeleteBranch = async (branchId: number) => {
    setIsPending(true);
    const res = await DeleteBranch(branchId);
    if (res?.data) {
      setBranches(branches.filter((el) => el.id !== branchId));
      notify(`La branche a été supprimé.`, NotifyActions.Successful);
    } else {
      notify("Échec de suppression de la branche", NotifyActions.Error);
    }
    setIsPending(false);
    setIsDeleteOpen(false);
  };

  return (
    <>
      {/* Popup for create an branche */}
      <Modal open={isCreationOpen} hide={setIsCreationOpen} size="sm">
        {/* TODO: Form for create an branche */}
        <CreateBranchModal
          onSave={HandleAddBranch}
          onClose={onClose}
          isPending={isPending}
        />
      </Modal>

      {/* Popup for update an branche */}
      <Modal open={isUpdateOpen} hide={setIsUpdateOpen} size="sm">
        {/* TODO: Form for update an branche */}
        <UpdateBranchModal
          actualBranch={actualBranch}
          onSave={HandleEditBranch}
          onClose={onClose}
          isPending={isPending}
        />
      </Modal>

      {/* Popup for delete an branche */}
      <Modal open={isDeleteOpen} hide={setIsDeleteOpen} size="sm">
        {/* TODO: Form for update an branche */}
        <DeleteBranchModal
          onDelete={HandleDeleteBranch}
          onClose={onClose}
          selectedBranch={selectedBranch}
          isPending={isPending}
        />
      </Modal>

      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>branches</code>.
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

      <Row>
        <Col md={12}>
          <Table striped hover>
            <thead>
              <th>Nom</th>
              <th>Ordre</th>
              <th>Date de création</th>
              <th></th>
            </thead>
            <tbody>
              {branches?.map((branch, index) => {
                return (
                  <tr key={index}>
                    <td>{branch.name}</td>
                    <td>{branch.orderBranch}</td>
                    <td>
                      {branch.createdAt
                        ? moment(
                            typeof branch.createdAt === "string"
                              ? new Date(branch.createdAt)
                              : branch.createdAt,
                            "DD-MM-YYYY"
                          ).format("DD-MM-YYYY")
                        : null}
                    </td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <FontAwesomeIcon
                          icon={faPen}
                          fixedWidth
                          className="align-middle mr-3"
                          onClick={() => {
                            onEdit(branch.id);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="align-middle"
                          onClick={() => {
                            onDelete(branch.id);
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

export default BranchTab;
