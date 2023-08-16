import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, CardBody, Col, Container, FormGroup, FormText, Input, InputGroup, InputGroupText, Label, Row, Spinner } from "reactstrap"
import { resetPasswordToken } from "../../services/auth";
import {useDashboard} from "../../hooks/dashboard";
import { permissionsList } from "../../models/Right/permission";
import { useUser } from "../../components/context/user.context";

type SC = {
    password: string,
    passwordVerif: string
}
const ResetPasswordToken = () => {
    const { dashboards } = useDashboard();
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const token = location.search.split("=")[1]
    const [mask, setMask] = useState({
        pass: true,
        passVerif: true
    })


    const { handleSubmit, formState: { errors }, control, reset, setError } = useForm<SC>();
    const handleLogin: SubmitHandler<SC> = async ({ password, passwordVerif }) => {

        if (password !== passwordVerif) {
            setError('passwordVerif', { type: 'custom', message: 'Le mot de passe ne correspond pas' })
            return
        }

        const userContext = useUser();
        const allowedDashboards = dashboards.filter(dashboard =>
          userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
          || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))

        setLoading(true)
        resetPasswordToken(password, token)
            .then((res: any) => {
                setLoading(false)
                if (res.data.message) {
                    reset({ password: '', passwordVerif: '' })
                    toast.success(res.data.message)
                    const timer = setTimeout(() => {
                        navigate(`/dashboard/${allowedDashboards.length === 0 ? 'undefined' : allowedDashboards[0].id}`)
                        clearTimeout(timer)
                    }, 1000)
                } else {
                    toast.error(res.data.error)
                }
            })
            .catch(() => {
                setLoading(false)
                toast.error('Une erreur est survenue !')
            })
    }

    return <Container fluid style={{ paddingTop: '4%' }}>
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
        <div className="text-center mt-4">
            <h2>Réinitialiser votre mot de passe</h2>
            <p className="lead">Entrer votre nouveau mot de passe</p>
        </div>
        <Row className="justify-content-md-center h-100">
            <Col md={5}>
                <Card>
                    <CardBody>
                        <form className="m-sm-4 " method="post" onSubmit={e => e.preventDefault()}>
                            <FormGroup className="w-75" style={{ paddingTop: '10px' }}>
                                <Label for="password">
                                    Nouveau mot de passe
                                </Label>
                                <InputGroup>
                                    <Controller
                                        control={control}
                                        name="password"
                                        rules={{ required: "Specifiez votre mot de passe" }}
                                        render={({ field }) => (
                                            <>
                                                <Input {...field} type={mask.pass ? "password" : "text"} invalid={errors[field.name]?.message ? true : false} id="password" />
                                            </>
                                        )}
                                    />
                                    <InputGroupText onClick={() => setMask(m => { return { ...m, pass: !m.pass } })}>
                                        <FontAwesomeIcon
                                            icon={mask.pass ? faEye : faEyeSlash}
                                            fixedWidth
                                            className="align-middle"
                                        />
                                    </InputGroupText>
                                </InputGroup>
                                {errors.password && <FormText color="danger">{errors.password.message}</FormText>}
                            </FormGroup>
                            <FormGroup className="w-75">
                                <Label for="passwordVerif">
                                    Confirmer
                                </Label>
                                <InputGroup>
                                    <Controller
                                        control={control}
                                        name="passwordVerif"
                                        rules={{ required: "Confirmer le mot de passe" }}
                                        render={({ field }) => (
                                            <>
                                                <Input {...field} type={mask.passVerif ? "password" : "text"} invalid={errors[field.name]?.message ? true : false} id="passwordVerif" />
                                            </>
                                        )}
                                    />
                                    <InputGroupText onClick={() => setMask(m => { return { ...m, passVerif: !m.passVerif } })}>
                                        <FontAwesomeIcon
                                            icon={mask.passVerif ? faEye : faEyeSlash}
                                            fixedWidth
                                            className="align-middle"
                                        />
                                    </InputGroupText>
                                </InputGroup>
                                {errors.passwordVerif && <FormText color="danger">{errors.passwordVerif.message}</FormText>}
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    disabled={loading}
                                    onClick={handleSubmit(handleLogin)}
                                    className="d-flex align-items-center"
                                >
                                    Enregistrer
                                    {loading && <Spinner color="light" size="sm" children="" className="ml-2" />}
                                </Button>
                            </FormGroup>
                        </form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default ResetPasswordToken