import {Controller, SubmitHandler, useForm} from "react-hook-form";
import { ListItemText, MenuItem, Select, Checkbox } from "@material-ui/core";
import {SchemaOf} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Col, FormGroup, Input, Row} from "reactstrap";
import React, { useState } from "react";
import {useASCategory} from "../../../../../hooks/Assignation/ascategory";
import {useUser} from "../../../../../hooks/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faFile, faPaperclip, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import DropZone from "../../../../../components/common/drop-zone/DropZone";

import "./serviceForm.scss";
import { useAssignation } from "../../../../../components/context/assignation.context";
import CharactersCounter from "../../../../ficheSecurite/creation/components/charactersCounter";

type TaskAddType = {
    title: string,
    description?: string,
    remain?: string,
    estimation?: string,
    categoryId?: number,
    responsibles: Array<string>,
    tableId?: number
}

type ChecklistAddType = {id: number, label: string, done: 0 | 1}
type FileAddType = {id: number, label: string, file: File}

export const Form = (
    props: {
        onSubmit: SubmitHandler<TaskAddType>,
        validationSchema: SchemaOf<TaskAddType>,
        initialValues: TaskAddType,
        additionnalElements: { checklist: ChecklistAddType[], setChecklist: Function, files: FileAddType[], setFiles: Function }
    }) => {

    const { tables } = useAssignation();

    const {
        onSubmit,
        validationSchema,
        initialValues,
        additionnalElements: { checklist, setChecklist, files, setFiles }
    } = props;

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch
    } = useForm<TaskAddType>({
        resolver: yupResolver(validationSchema)
    });

    const { ascategories } = useASCategory();
    const { users } = useUser();
    const [selectedCategory, setSelectedCategory] = useState<number>(initialValues.categoryId || 0);
    const [hoveredCategory, setHoveredCategory] = useState<number | undefined>(undefined);
    const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(initialValues.responsibles);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row >
                <Col lg={8} md={8} sm={8} xs={12}>

                    {/* Task title */}
                    <FormGroup>
                        <label
                            htmlFor='title'
                            style={{ display: 'block' }}
                        >
                            Titre
                        </label>
                        <CharactersCounter
                          actualValue={watch('title')}
                          maxCharacter={150}
                          inputRender={(max: number) => <Controller
                            name='title'
                            defaultValue={initialValues.title}
                            control={control}
                            render={({ field }) =>
                              <Input
                                autoComplete='off'
                                type='text'
                                id='title'
                                maxLength={max}
                                className={
                                  errors.title
                                    ? 'text-input-error'
                                    : 'text-input'
                                }
                                {...field}
                              />
                            }
                          />}
                        />
                        {errors.title && (
                            <div className='input-feedback'>{errors.title.message}</div>
                        )}
                    </FormGroup>

                    {/* Task description */}
                    <FormGroup>
                        <label
                            htmlFor='description'
                            style={{ display: 'block' }}
                        >
                            Description
                        </label>
                        <CharactersCounter
                            actualValue={watch ? watch('description') || '' : ''}
                            maxCharacter={200}
                            inputRender={(max: number) => {
                                return <Controller
                                    name="description"
                                    defaultValue={initialValues.description}
                                    control={control}
                                    render={({ field }) =>
                                        <Input
                                            autoComplete="off"
                                            type="textarea"
                                            maxLength={max}
                                            id="description"
                                            className={
                                                errors.description
                                                    ? 'text-input-error'
                                                    : 'text-input'
                                            }
                                            {...field}
                                        />
                                    }
                                />
                            }}
                        />
                        {errors.description && (
                            <div className="input-feedback">{errors.description.message}</div>
                        )}
                    </FormGroup>
                </Col>

                <Col lg={4} md={4} sm={4} xs={12}>
                    {/* Task Table */}
                    {
                        !initialValues.tableId && (
                            <FormGroup>
                                <label
                                    htmlFor='tableId'
                                    style={{ display: 'block' }}
                                >
                                    Table
                                </label>
                                <Controller
                                    name="tableId"
                                    control={control}
                                    defaultValue={initialValues.tableId}
                                    render={({ field }) => <Input
                                        type='select'
                                        id='tableId'
                                        className="form-control"
                                        {...field}
                                    >
                                        <option value={0}>Sélectionnez une table</option>
                                        {tables &&
                                            tables.map((table) => {
                                                return (
                                                    <option value={table.id} key={`table${table.id * Date.now()}`}>
                                                        {table.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </Input>
                                    } />
                                {errors.tableId && (
                                    <div className='input-feedback'>{errors.tableId.message}</div>
                                )}
                            </FormGroup>
                        )
                    }

                    {/* Task catgeory */}
                    <FormGroup>
                        <label
                            htmlFor='categoryId'
                            style={{ display: 'block' }}
                        >
                            Catégorie
                        </label>
                        {ascategories &&
                          ascategories.map((category) =>
                            <span
                              className="categoryCard"
                              key={`cat${category.id * Date.now()}`}
                              onClick={() => {
                                setValue('categoryId', category.id)
                                setSelectedCategory(category.id)
                              }}
                              style={{
                                border: '1px solid ' + category.color,
                                color: [selectedCategory, hoveredCategory].includes(category.id) ? 'white' : category.color,
                                backgroundColor: [selectedCategory, hoveredCategory].includes(category.id) ? category.color : 'white',
                                fontWeight: 500,
                                marginBottom: 5,
                                marginRight: 5,
                                padding: '2px 12px',
                                borderRadius: 25,
                                fontSize: 14,
                                cursor: "pointer",
                                boxShadow: '0 2px 4px rgb(126 142 177 / 12%)',
                                display: 'inline-block'
                              }}
                              onMouseEnter={() => setHoveredCategory(category.id)}
                              onMouseLeave={() => setHoveredCategory(undefined)}
                            >
                              {category.name}
                            </span>
                          )
                        }
                        {errors.categoryId && (
                            <div className='input-feedback'>{errors.categoryId.message}</div>
                        )}
                    </FormGroup>

                    {/* Responsible user */}
                    <FormGroup>
                        <label
                            htmlFor='responsibles'
                            style={{ display: 'block' }}
                        >
                            Responsables Tâche
                        </label>
                        <Controller
                            name="responsibles"
                            control={control}
                            defaultValue={initialValues.responsibles}
                            render={() => <Select
                                id="responsibles"
                                className="form-control"
                                multiple
                                renderValue={(selected: any) => {
                                    return (
                                        users?.filter(user => selected.includes(user.id.toString()))
                                            .map(user => `${user.lastname?.toUpperCase()} ${user.firstname}`)
                                            .join(', ')
                                    );
                                }}
                                MenuProps={{
                                    variant: "menu",
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }}
                                defaultValue={selectedResponsibles}
                                value={selectedResponsibles}
                                onChange={(event) => {
                                    setValue('responsibles', event.target.value as string[])
                                    setSelectedResponsibles(event.target.value as string[])
                                }}
                            >
                                <option value={0}>Sélectionnez un responsable</option>
                                {users &&
                                    users.map((user) => {
                                        return (
                                            <MenuItem key={`responsible-${user.id}`} value={user.id.toString()}>
                                                <Checkbox checked={selectedResponsibles.indexOf(user.id.toString()) >= 0} />
                                                <ListItemText primary={`${user.lastname?.toUpperCase()} ${user.firstname}`} />
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                            } />
                            {errors.responsibles && (
                                <div className='input-feedback'>{errors.responsibles.message}</div>
                            )}
                    </FormGroup>
                </Col>
            </Row>

            <Row className="justify-content-between">
                <Col>
                    <FormGroup style={{ width: 160 }}>
                        <label
                            htmlFor='estimation'
                            style={{ display: 'block' }}
                        >
                            Date limite
                        </label>
                        <Controller
                            name='estimation'
                            defaultValue={initialValues.estimation}
                            control={control}
                            render={({ field }) =>
                                <Input
                                    autoComplete='off'
                                    type='date'
                                    id='estimation'
                                    className={
                                        errors.title
                                            ? 'text-input-error'
                                            : 'text-input'
                                    }
                                    {...field}
                                />
                            }
                        />
                        {errors.estimation && (
                            <div className='input-feedback'>{errors.estimation.message}</div>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <label
                            style={{ display: 'block' }}
                        >
                            <FontAwesomeIcon icon={faCheckSquare} />
                            &nbsp;
                            { `Checklist ${checklist.length ? Math.floor(checklist.filter(c => c.done).length / checklist.length * 100) : 0} %` }
                        </label>
                        <progress className="d-block w-50" style={{ height: 20 }} value={((checklist.filter(c => c.done).length / checklist.length) || 0) * 100} max="100" />
                        {
                            checklist.map((check) => {
                                return (
                                    <div key={`check-${check.id}`}>
                                        <input
                                            type="checkbox"
                                            defaultChecked={check.done === 1}
                                            onChange={() =>
                                                setChecklist(checklist.map(c => {
                                                    if (c.id === check.id) {
                                                        c.done = c.done === 0 ? 1 : 0
                                                    }
                                                    return c
                                                }))}
                                        />
                                        &nbsp;
                                        <span style={{position: "absolute", zIndex: -9999, opacity: 0}}>{check.label}</span>
                                        <input
                                            type="text"
                                            defaultValue={check.label}
                                            className="input-checklist-name"
                                            style={{
                                                width: check.label.length * (8 - check.label.length / 40),
                                                textDecoration: check.done ? 'line-through': 'none',
                                                color: check.done ? 'grey': 'black'
                                            }}
                                            onKeyUp={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    (event.target as HTMLInputElement).blur()
                                                }
                                            }}
                                            onBlur={async (event) => {
                                                if (event.target.value === "") {
                                                    event.target.value = check.label
                                                } else {
                                                    setChecklist(checklist.map(c => {
                                                        if (c.id === check.id) {
                                                            c.label = event.target.value
                                                        }
                                                        return c
                                                    }))
                                                }
                                            }}
                                        />&nbsp;
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => setChecklist(checklist.filter(c => {
                                            return c.id !== check.id
                                        }))} />
                                    </div>
                                )
                            })
                        }
                        <button
                            type="button"
                            className="btn btn-success mt-3"
                            onClick={() => setChecklist(checklist.concat({id: checklist.length + 1, label: '', done: 0}))}
                        >
                            Ajouter un élément
                        </button>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <label
                            style={{ display: 'block' }}
                        >
                            <FontAwesomeIcon icon={faPaperclip} />
                            &nbsp;
                            Pièces jointes
                        </label>
                        {
                            files.map(pj =>
                                <div key={`pj-${pj.id}`}>
                                    {/*<a href={`${process.env.REACT_APP_PUBLIC_URL}/${pj.path}`} target="_blank">*/}
                                    <FontAwesomeIcon icon={faFile} />
                                    {/*</a>*/}
                                    &nbsp;
                                    {pj.label}
                                    &nbsp;
                                    <FontAwesomeIcon icon={faTrashAlt} onClick={() => setFiles(files.filter(file => file.id !== pj.id))} />
                                </div>
                            )
                        }
                        <DropZone
                            maxSize={4}
                            fileType={["JPG", "PNG", "PDF", "XLSX", "CSV", "DOCX", "TXT", "ODS", "ODT"]}
                            onHandleFile={(file: File) => setFiles(files.concat({id: files.length + 1, label: file.name, file: file}))}
                            maxSizeOutput={0.5}
                            colorPrimary="#3b7ddd"
                            colorError="crimson"
                            colorText="#3e4676"
                        >
                            Ajouter un fichier
                        </DropZone>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type='submit' className='btn btn-primary'
                            disabled={!!(errors.title)} style={{ margin: '6px' }}>
                      Enregistrer
                    </button>
                </Col>
            </Row>
        </form>
    )
}