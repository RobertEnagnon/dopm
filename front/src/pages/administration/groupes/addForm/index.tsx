import * as React from "react";
import { Button, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { Group } from "../../../../models/Right/group";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from "react-hook-form";

interface Props {
  onSave(_group: Group): void
  onClose(): void,
  isPending: boolean
}

const CreateGroupModal: React.FC<Props> = ({ onSave, onClose, isPending }) => {

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
      Création d'un groupe
    </ModalHeader>
    <ModalBody>
      <FormGroup>
        <InputGroup size="lg">
          <InputGroupText>Nom</InputGroupText>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <>
                <Input {...field} invalid={errors[field.name]?.message ? true : false} />
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
        Creer
        {isPending && <Spinner size="sm" children=""/>}
      </Button>
    </ModalFooter>
  </>
}

export default CreateGroupModal