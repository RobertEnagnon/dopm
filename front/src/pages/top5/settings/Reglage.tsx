import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  UncontrolledDropdown,
} from "reactstrap";
import { useUser } from "../../../components/context/user.context";
import { SaveAlterateDate } from "../../../services/Top5/sitting";

const AlterateDate = () => {
  const userContext = useUser();
  const [alterateDate, setAlterateDate] = useState<boolean>(
    userContext.currentUser.isAlterateDate ?? false
  );

  const handleAlterateDate = useCallback(async () => {
    await SaveAlterateDate({
      alterateDate: !alterateDate,
      userId: userContext.currentUser.id,
    })
      .then((res) => {
        if (!res) throw new Error("");
        setAlterateDate(!alterateDate);
        const user = res?.data.user;
        userContext.setCurrentUser((u: any) => {
          return {
            ...u,
            isAlterateDate: res?.data.user.isAlterateDate,
          };
        });
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Réglages sauvegardés avec succes");
      })
      .catch((error) => {
        console.log("isAlterateDate error", error);
        toast.error("Erreur lors de la sauvegarde des réglages");
      });
  }, []);

  return (
    <DropdownItem
      className="d-flex align-items-center"
      onClick={(e) => {
        e.stopPropagation();
        handleAlterateDate();
      }}
    >
      <FormGroup className="d-flex m-0 p-0">
        <Col md={1}>
          <Input
            id="alt-date"
            className="ml-0"
            type="checkbox"
            checked={alterateDate}
          />
        </Col>
        <Col>
          <Label for="alt-date" className="m-0">
            Default date J-1
          </Label>
        </Col>
      </FormGroup>
    </DropdownItem>
  );
};

export default function Reglage() {
  /**
   * Alteratedate
   */

  return (
    <div className={"card-actions float-right"}>
      <UncontrolledDropdown className={"d-inline-block"}>
        {/*<Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">*/}
        <DropdownToggle color="transparent">
          <FontAwesomeIcon icon={faEllipsis} className="align-middle" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right mt-4">
          {/* <DropdownItem header text className="pl-1"><p className="h5">Réglages</p></DropdownItem> */}

          <AlterateDate />
          {/**
           * Ajouter des lignes en utilisant
           * <DropdownItem>
           *  Votre contenu ici
           * </DropdownItem>
           */}
        </DropdownMenu>
        {/*</Dropdown>*/}
      </UncontrolledDropdown>
    </div>
  );
}
