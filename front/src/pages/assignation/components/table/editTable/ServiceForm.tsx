import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {SchemaOf} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Col, FormGroup, Input, Row} from "reactstrap";
import {Color, Colors} from "../../../../../utils/dopm.utils";
import React from "react";

type TableEditType = {
    id?: number,
    name: string,
    description?: string,
    color?: string
}

export const Form = (
    props: {
        onSubmit: SubmitHandler<TableEditType>,
        validationSchema: SchemaOf<TableEditType>,
        initialValues: TableEditType,
    }) => {

    const {
        onSubmit,
        validationSchema,
        initialValues,
    } = props;

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<TableEditType>({
        resolver: yupResolver(validationSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Table name */}
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <label
                            htmlFor='name'
                            style={{ display: 'block' }}
                        >
                            Nom
                        </label>
                        <Controller
                            name='name'
                            defaultValue={initialValues.name}
                            control={control}
                            render={({ field }) =>
                                <Input
                                    autoComplete='off'
                                    type='text'
                                    id='name'
                                    className={
                                        errors.name
                                            ? 'text-input-error'
                                            : 'text-input'
                                    }
                                    {...field}
                                />
                            }
                        />
                        {errors.name && (
                            <div className='input-feedback'>{errors.name.message}</div>
                        )}
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup>
                        <label htmlFor='color' style={{ display: 'block' }}>
                            Couleur
                        </label>
                        <Controller
                            name="color"
                            control={control}
                            defaultValue={initialValues.color}
                            render={({ field }) => <Input
                                type='select'
                                id='color'
                                className='select-input'
                                style={{ backgroundColor: watch('color') || initialValues.color, color: Color.white }}
                                {...field}
                            >
                                {Colors.map((color, index) => {
                                    return (
                                        <option
                                            key={`color${index}`}
                                            value={color.value}
                                            style={{
                                                backgroundColor:`${color.value}`,
                                                color: Color.white,
                                            }}
                                        >
                                            {color.name}
                                        </option>
                                    );
                                })}
                            </Input>
                            }
                        />
                    </FormGroup>
                </Col>
            </Row>

            {/* Table description */}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor='description'
                            style={{ display: 'block' }}
                        >
                            Description
                        </label>
                        <Controller
                            name='description'
                            defaultValue={initialValues.description}
                            control={control}
                            render={({ field }) =>
                                <Input
                                    autoComplete='off'
                                    type='text'
                                    id='name'
                                    className='text-input'
                                    {...field}
                                />
                            }
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type='submit' className='btn btn-primary'
                            disabled={!!(errors.name)} style={{ margin: '6px' }}>
                        Enregistrer
                    </button>
                </Col>
            </Row>
        </form>
    )
}
