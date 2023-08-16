import React, { useEffect } from "react";
import { Container, Form, FormGroup, Label, Input, FormText, Button, Row, Col, FormFeedback } from "reactstrap"
import "./index.scss"
import * as Yup from "yup";
import { IConnectionAd } from "../../../models/ad"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { createConnection, getConnection, modifiyConnection, deleteConnection } from "../../../services/ad"

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from "react-hook-form";
import { notify, NotifyActions } from "../../../utils/dopm.utils";

const ConnectionAd = () => {

    const validationSchema = Yup.object({
        id: Yup.number(),
        login_url: Yup.string().required(
            "Ce champ est obligatoire"
        ),
        logout_url: Yup.string().required(
            "Ce champ est obligatoire"
        ),
        certificat: Yup.string().required(
            "Ce champ est obligatoire"
        ),
        disable: Yup.string()
    });

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<IConnectionAd>({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        getCurrentConnection();
    }, [])

    const getCurrentConnection = async () => {

        const connections = await getConnection();
        if (connections!.length > 0) {
            const connection: IConnectionAd = connections![0];
            setValue('id', connection.id)
            setValue('login_url', connection.login_url)
            setValue('logout_url', connection.logout_url)
            setValue('certificat', connection.certificat)
            setValue('disable', connection.disable)
        }
    }

    const onDelete = async (id: number) => {

        try {
            await deleteConnection(id);
            reset({
                id: undefined,
                login_url: "",
                logout_url: "",
                certificat: "",
                disable: ""
            });
            notify("Connexion supprimée", NotifyActions.Successful);
        } catch (err) {
            console.log(err)
            notify("Erreur de suppression", NotifyActions.Error);
        }
    }

    const onSubmit = async (connection: IConnectionAd) => {
        if (connection.id) {

            try {
                await modifiyConnection(connection);
                notify("Connexion modifiée", NotifyActions.Successful);
            } catch (err) {
                console.log(err)
                notify("Erreur de modification", NotifyActions.Error);
            }
        } else {
            try {
                const res = await createConnection(connection)
                notify("Connexion ajoutée", NotifyActions.Successful);
                setValue('id', res.connection.id)
            } catch (err) {
                console.log(err)
                notify("Erreur de création", NotifyActions.Error);
            }

        }
    }

    const CONDITION_DISABLE: boolean = watch('disable') ? true : false;

    return (
        <Container fluid>
            <Row>
                <Col
                    md={{
                        offset: 3,
                        size: 6
                    }}
                    sm="12"
                >
                    <div className="centerTitle">
                        <h1 className="mb-5 mt-2 pr-2">Connexion AD</h1>
                        {watch('id') && (
                            <>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    style={{ cursor: "pointer" }}
                                    fixedWidth
                                    className="align-middle btn-icon"
                                    onClick={() => onDelete(watch('id') || 0)}
                                />
                            </>
                        )}
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup disabled={CONDITION_DISABLE}>
                            <Label for="login_url">Lien de login de l'AD</Label>
                            <Controller
                                name="login_url"
                                control={control}
                                render={({ field }) => <Input
                                    type="text"
                                    id="login_url"
                                    invalid={errors.login_url !== undefined}
                                    disabled={CONDITION_DISABLE}
                                    {...field}
                                />}
                            />

                            <FormText>
                                Lien vers lequel l'utilisateur va être redirigé pour s'authentifier
                            </FormText>
                            {errors.login_url && (
                                <FormFeedback className="input-feedback">{errors.login_url.message}</FormFeedback >
                            )}
                        </FormGroup>
                        <FormGroup disabled={CONDITION_DISABLE}>
                            <Label for="logout_url">Lien de logout de l'AD</Label>
                            <Controller
                                name="logout_url"
                                control={control}
                                render={({ field }) => <Input
                                    type="text"
                                    id="logout_url"
                                    invalid={errors.logout_url !== undefined}
                                    disabled={CONDITION_DISABLE}
                                    {...field}
                                />}
                            />

                            <FormText>
                                Lien pour déconnecter l'utilisateur de l'AD
                            </FormText>
                            {errors.login_url && (
                                <FormFeedback className="input-feedback">{errors.login_url.message}</FormFeedback >
                            )}
                        </FormGroup>
                        <FormGroup disabled={CONDITION_DISABLE}>
                            <Label for="certificat">Certificatf de l'AD</Label>
                            <Controller
                                name="certificat"
                                control={control}
                                render={({ field }) => <Input
                                    autoComplete="off"
                                    type="textarea"
                                    id="certificat"
                                    invalid={errors.certificat !== undefined}
                                    disabled={CONDITION_DISABLE}
                                    {...field}
                                />}
                            />
                            {errors.certificat && (
                                <FormFeedback className="input-feedback">{errors.certificat.message}</FormFeedback >
                            )}
                        </FormGroup>
                        <FormGroup check inline>
                            <Controller
                                name="disable"
                                control={control}
                                render={({ field }) => <Input
                                    type="checkbox"
                                    id="disable"
                                    checked={watch('disable') || watch('disable') == 'true' ? true : false}
                                    {...field}
                                />}
                            />
                            <Label check>Désactiver la connexion AD</Label>

                        </FormGroup>

                        <Row className="mt-5">
                            <Col
                                md={{
                                    offset: 5,
                                    size: 3
                                }}>
                                <Button color="primary" type="submit" disabled={(errors.login_url || errors.certificat) ? true : false}>
                                    Enregistrer
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
            </Row>
        </Container >
    )
}

export default ConnectionAd;