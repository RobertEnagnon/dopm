// @ts-nocheck
import { Checkpoint } from "../../../../../models/AuditTerrain/checkpoint";
import { Service } from "../../../../../models/service";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { useFieldArray, useForm } from "react-hook-form";
import EvaluationRowMobile from "./evaluationRowMobile";
import { useEffect } from "react";
import { Button, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React from "react";

type AuditCardProps = {
    checkpoints: Array<Checkpoint>;
    date: Date;
    service: Service;
    addAudit: Function;
};

type AuditAddType = {
    date: Date;
    serviceId: number;
    evaluations: any;
};

export interface FormValues {
    date: Date;
    serviceId: number;
    evaluations: Array<{
        checkpoint: Checkpoint;
        check: string;
        comment: string;
        image: string;
    }>;
}

const AddAuditMobile = ({
    checkpoints,
    date,
    service,
    addAudit,
}: AuditCardProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        register,
        setValue,
        watch,
        getValues,
    } = useForm<FormValues>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            date: new Date(),
            serviceId: 0,
            evaluations: [],
        },
    });
    const {
        fields: evaluationFields,
        update,
        // @ts-ignore
    } = useFieldArray({
        name: "evaluations",
        control,
    });

    useEffect(() => {
        if (service && checkpoints) {
            // @ts-ignore
            setValue("date", date);
            setValue("serviceId", service.id);
            setValue(
                "evaluations",
                checkpoints.map((c) => ({
                    checkpoint: c,
                    check: "",
                    comment: "",
                    image: "",
                }))
            );
        }
    }, [service, checkpoints, setValue]);

    const handleAddAudit = async (audit: AuditAddType) => {
        if (
            audit.evaluations.some(
                (e: {
                    checkpoint: Checkpoint;
                    check: null | string;
                    comment: string;
                    image: string;
                }) => e.check != ""
            )
        ) {
            try {
                const newAudit = await addAudit(audit);
                notify(
                    `L'audit ${newAudit?.service?.name} du ${new Date(
                        newAudit?.date
                    )?.toLocaleDateString()} a été ajouté`,
                    NotifyActions.Successful
                );
            } catch (e) {
                console.log(e);
                notify("Ajout impossible", NotifyActions.Error);
            }
        } else {
            notify("Vous devez valider au moins un checkpoint.", NotifyActions.Error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleAddAudit)}>
            <EvaluationRowMobile
                errors={errors}
                control={control}
                register={register}
                checkpoints={checkpoints}
                evaluationFields={evaluationFields}
                watch={watch}
                setValue={setValue}
                date={date}
                update={update}
                getValues={getValues}
            />
            <Row>
                <Col
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "24px",
                    }}
                >
                    <Button
                        color="success"
                        type="submit"
                        style={{ padding: "12px 24px", fontSize: "16px" }}
                    >
                        Valider
                        <FontAwesomeIcon
                            icon={faCheck}
                            style={{
                                marginLeft: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                        />
                    </Button>
                </Col>
            </Row>
        </form>
    );
};

export default AddAuditMobile;
