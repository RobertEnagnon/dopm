import * as React from "react";
import { Button, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from "react-hook-form";
import { Group } from "../../../../models/Right/group";

interface Props {
  group: Group,
  onSave(_group: Group): void,
  onClose(): void,
  isPending: boolean
}

const UpdateGroupModal: React.FC<Props> = ({ group, onSave, onClose, isPending }) => {
  const formSchema = Yup.object().shape({
    name: Yup.string().required('Entrer le Nom du groupe'),
  });

  const validationOpt = { resolver: yupResolver(formSchema) };

  const { handleSubmit, formState, control } = useForm<Group>(validationOpt);

  const { errors } = formState;


  return <>
    <ModalHeader
      close={
        <button className="close" onClick={onClose}>
          ×
        </button>
      }
      toggle={onClose}
    >
      Modification Groupe
    </ModalHeader>
    <ModalBody>
      <FormGroup>
        <InputGroup size="lg">
          <InputGroupText>Nom</InputGroupText>
          <Controller
            control={control}
            name="name"
            defaultValue={group.name}
            render={({ field }) => (
              <>
                <Input {...field} invalid={errors[field.name]?.message ? true : false} placeholder="Nouveau nom"/>
                <FormFeedback>
                  {errors[field.name]?.message}
                </FormFeedback>
              </>
            )}
          />
        </InputGroup>
      </FormGroup>
    </ModalBody>
    <ModalFooter>
      <Button color="gray-dark" onClick={onClose}>
        Annuler
      </Button>
      <Button color="primary" className="btn-spinner" onClick={handleSubmit(onSave)} disabled={isPending}>
        Enregistrer
        {isPending && <Spinner size="sm" children=""/>}
      </Button>
    </ModalFooter>
  </>
}

export default UpdateGroupModal