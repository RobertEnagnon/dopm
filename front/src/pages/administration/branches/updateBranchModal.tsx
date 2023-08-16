import * as React from "react";
import { Button, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { Branch } from "../../../models/Top5/branch";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from "react-hook-form";
import './branch.scss';
import moment from "moment";

interface Props {
    actualBranch: Branch,
    onSave(_branchData: Branch): void,
    onClose(): void,
    isPending: boolean
}

const UpdateBranchModal: React.FC<Props> = ({ actualBranch, onSave, onClose, isPending }) => {
    const formSchema = Yup.object().shape({
        name: Yup.string().required('Entrer le Nom de la branche'),
    });
    
    const validationOpt = { resolver: yupResolver(formSchema) };

    const { handleSubmit, formState, control } = useForm<Branch>(validationOpt);

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
        Modification Branche
      </ModalHeader>
      <ModalBody>
        <FormGroup>
            <InputGroup size="lg">
                <InputGroupText>Nom</InputGroupText>
                <Controller
                control={control}
                name="name"
                defaultValue={actualBranch.name}
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
                    defaultValue={actualBranch.createdAt? moment(actualBranch.createdAt).format('YYYY-MM-DD'): ''}
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

export default UpdateBranchModal