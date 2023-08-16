
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, FormGroup, FormText, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { CommentHisto } from "../../../services/Top5/historical";

type Com = {
    id: number,
    month: number,
    year: string,
    indicatorId: number,
    defaultComment: string,
    dataValue: {
        target: string,
        data: string
    }
}

export default function IndicatorComment({id, month, year, indicatorId, defaultComment, dataValue}: Com) {
    interface SC {
        comment: string
    }
    const { handleSubmit, formState: { errors }, control } = useForm<SC>();

    const [show, setShow] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const toggle = () => {
        setShow(s => !s)
    }
    const submit: SubmitHandler<SC> = async (data) => {
        setIsPending(true)
        const dataToSend = {
            id, month, year, indicatorId,
            comment: data.comment
        }
        const res = await CommentHisto(dataToSend, dataValue)
        setIsPending(false)
        if (res?.status !== 200 && res?.status !== 201) { //erreur
            toast.error('Une erreur est survenue')
            setShow(false)
        } else {
            if (res.data.error) {
                toast.warning(res.data.error)
                setShow(false)
            } else { //succes
                toast.success("Commentaire enregistré avec succes")
                setShow(false)
            }
        }
    }

    return <div>
        <Button color="primary" size="sm" onClick={toggle}>
            <FontAwesomeIcon icon={faPlus} className="align-middle" />
        </Button>
        <Modal
            toggle={toggle}
            isOpen={show}
            size="sm"
        >
            <ModalHeader toggle={toggle}>
                Ajouter votre commentaire
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="comment">
                        Commentaire {month}/{year}&nbsp;:
                    </Label>
                    <InputGroup>
                        <Controller
                            control={control}
                            name="comment"
                            rules={{ required: "Entrer votre commentaire" }}
                            defaultValue={defaultComment}
                            render={({ field }) => (
                                <>
                                    <Input {...field} type="textarea" maxLength={100} invalid={errors[field.name]?.message ? true : false} id="comment" />
                                </>
                            )}
                        />
                    </InputGroup>
                    {errors.comment && <FormText color="danger">{errors.comment.message}</FormText>}
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button onClick={toggle} color="primary">
                    Annuler
                </Button>
                <Button
                    color="success"
                    onClick={handleSubmit(submit)}
                    disabled={isPending}
                    className="d-flex align-items-center"
                >
                    Valider
                    {isPending && <Spinner color="light" size="sm" children="" className="ml-2" />}
                </Button>
                
            </ModalFooter>
        </Modal>
    </div>
}