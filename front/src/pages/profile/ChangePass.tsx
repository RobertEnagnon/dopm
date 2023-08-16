import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { Button, FormGroup, FormText, Input, InputGroup, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { resetPassword } from "../../services/auth";

type SC = {
    oldPassword: string,
    newPassword: string
}

export default function ChangePass() {
    const { handleSubmit, formState: { errors }, control, reset } = useForm<SC>();

    const [show, setShow] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [mask, setMask] = useState({
        old: true,
        new: true
    })
    const toggle = () => {
        if (show === true) { //on vide avant de fermer
            reset({
                oldPassword: '',
                newPassword: ''
            })
        }
        setShow(s => !s)
    }
    const submit: SubmitHandler<SC> = async (data) => {
        setIsPending(true)
        const res = await resetPassword(data)
        setIsPending(false)
        reset({
            oldPassword: '',
            newPassword: ''
        })
        if (res?.status !== 200 && res?.status !== 201) { //erreur
            toast.error('Une erreur est survenue')
            setShow(false)
        } else {
            if (res.data.error) { //mot de passe ne correspond pas
                toast.error(res.data.error)
                setShow(false)
            } else { //succes
                localStorage.setItem("authToken", res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data));
                toast.success("Mot de passe changé avec succes")
                setShow(false)
            }
        }
    }

    return <div>
        <Button color="danger" size="lg" onClick={toggle}>
            Changer de mot de passe
        </Button>
        <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <ToastContainer />
        <Modal
            toggle={toggle}
            isOpen={show}
            size="sm"
        >
            <ModalHeader toggle={toggle}>
                Changer de mot de passe
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="old-pass">
                        Ancien mot de passe
                    </Label>
                    <InputGroup>
                        <Controller
                            control={control}
                            name="oldPassword"
                            rules={{ required: "Specifiez le mot de passe" }}
                            render={({ field }) => (
                                <>
                                    <Input {...field} type={mask.old ? "password" : "text"} invalid={errors[field.name]?.message ? true : false} id="old-pass" />
                                </>
                            )}
                        />
                        <InputGroupText onClick={() => setMask(m => { return { ...m, old: !mask.old } })}>
                            <FontAwesomeIcon
                                icon={mask.old ? faEye : faEyeSlash}
                                fixedWidth
                                className="align-middle"
                            />
                        </InputGroupText>
                    </InputGroup>
                    {errors.oldPassword && <FormText color="danger">{errors.oldPassword.message}</FormText>}
                </FormGroup>
                <FormGroup>
                    <Label for="old-pass">
                        Nouveau mot de passe
                    </Label>
                    <InputGroup>
                        <Controller
                            control={control}
                            name="newPassword"
                            rules={{ required: "Specifiez le mot de passe" }}
                            render={({ field }) => (
                                <>
                                    <Input {...field} type={mask.new ? "password" : "text"} invalid={errors[field.name]?.message ? true : false} id="new-pass" />
                                </>
                            )}
                        />
                        <InputGroupText onClick={() => setMask(m => { return { ...m, new: !mask.new } })}>
                            <FontAwesomeIcon
                                icon={mask.new ? faEye : faEyeSlash}
                                fixedWidth
                                className="align-middle"
                            />
                        </InputGroupText>
                    </InputGroup>
                    {errors.newPassword && <FormText color="danger">{errors.newPassword.message}</FormText>}
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={handleSubmit(submit)}
                    disabled={isPending}
                    className="d-flex align-items-center"
                >
                    Valider
                    {isPending && <Spinner color="light" size="sm" children="" className="ml-2" />}
                </Button>
                {' '}
                <Button onClick={toggle}>
                    Annuler
                </Button>
            </ModalFooter>
        </Modal>
    </div>
}