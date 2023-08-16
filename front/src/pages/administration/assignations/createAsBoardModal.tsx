import { Button, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from "react-hook-form";
import "./dashboard.scss"
import { Dashboard } from "../../../models/dashboard";

type CreateDashboardType = {
    onSave(_dashboard: Dashboard): void,
    onClose(): void,
    isPending: boolean
}

const CreateAsBoardModal = ({ onSave, onClose, isPending }: CreateDashboardType) => {

    const formSchema = Yup.object().shape({
        name: Yup.string().required('Entrer un nom')
    });
    
    const validationOpt = { resolver: yupResolver(formSchema) };

    const { handleSubmit, formState, control } = useForm<Dashboard>(validationOpt);

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
        Création d'un AsBoard
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

export default CreateAsBoardModal