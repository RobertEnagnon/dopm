import * as React from "react";
import { Button, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from "react-hook-form";
import './dashboard.scss';
import moment from "moment";
import { Dashboard } from "../../../models/dashboard";

interface Props {
    currentDashboard: Dashboard,
    onSave(_dashboard: Dashboard): void,
    onClose(): void,
    isPending: boolean
}

const UpdateDashboardModal: React.FC<Props> = ({ currentDashboard, onSave, onClose, isPending }) => {
    const formSchema = Yup.object().shape({
        id: Yup.number().default(currentDashboard.id),
        name: Yup.string().required('Entrer un nom'),
        order: Yup.number().required('Entrer un ordre'),
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
        Modification Dashboard
      </ModalHeader>
      <ModalBody>
        <FormGroup>
            <InputGroup size="lg">
                <InputGroupText>Nom</InputGroupText>
                <Controller
                control={control}
                name="name"
                defaultValue={currentDashboard.name}
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
            <InputGroup size="lg">
                <InputGroupText>Ordre</InputGroupText>
                <Controller
                control={control}
                name="order"
                defaultValue={currentDashboard.order}
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
            <InputGroup size="lg" className="create_at">
                <InputGroupText>Créée le</InputGroupText>
                <Input 
                    defaultValue={moment(currentDashboard.createdAt).format('YYYY-MM-DD')}
                    disabled={true}
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

export default UpdateDashboardModal