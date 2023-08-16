import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {SchemaOf} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Col, FormGroup, Input, Row} from "reactstrap";
import React, { useState } from "react";
import {useASCategory} from "../../../../../hooks/Assignation/ascategory";
import {useUser} from "../../../../../hooks/user";
import { faCheckSquare, faPaperclip, faFile, faTrashAlt, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, ListItemText, MenuItem, Select } from "@material-ui/core";
import { Tooltip } from '@mui/material';
import { AsConversation, AsTask } from "../../../../../models/Assignation/asTask";
import { useAssignation } from "../../../../../components/context/assignation.context";
import "./serviceForm.scss";
import DropZone from "../../../../../components/common/drop-zone/DropZone";
import CharactersCounter from "../../../../ficheSecurite/creation/components/charactersCounter";
import DefaultAvatar from "../../../../../assets/img/avatars/avatar.webp";
import moment from "moment";
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

type TaskEditType = {
    title: string,
    description?: string,
    remain?: string,
    estimation?: string,
    categoryId?: number,
    responsibles: Array<string>,
    archived: number
}

export const Form = (
    props: {
        onSubmit: SubmitHandler<TaskEditType>,
        validationSchema: SchemaOf<TaskEditType>,
        initialValues: TaskEditType,
        task: AsTask
    }) => {
    const {
        onSubmit,
        validationSchema,
        initialValues,
        task
    } = props;
    const {
        addComment,
        addChecklist, updateChecklist, deleteChecklist,
        addFile, deleteFile,
        archivedView
    } = useAssignation();

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch
    } = useForm<TaskEditType>({
        resolver: yupResolver(validationSchema)
    });

    const { ascategories } = useASCategory();
    const { users } = useUser();
    const [selectedCategory, setSelectedCategory] = useState<number>(initialValues.categoryId || 0);
    const [hoveredCategory, setHoveredCategory] = useState<number | undefined>(undefined);
    const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(initialValues.responsibles);
    const [comment, setComment] = useState<string>('');

    const handleAddComment = async () => {
        await addComment(task.tableId, task.id, comment);
        setComment('');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row>

                <Col md={9} lg={9}>
                    <Row >
                        <Col lg={8} md={8} sm={8} xs={12}>

                            {/* Task title */}
                            <FormGroup style={{width:"95%"}}>
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
                            <FormGroup style={{width:"95%"}}>
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
                                                  style={{height:"80px"}}
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
                                <div className='input-feedback'>{errors.description.message}</div>
                              )}
                            </FormGroup>
                        </Col>

                        <Col lg={4} md={4} sm={4} xs={12}>
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
                            </FormGroup>

                            {/* Responsible user */}
                            <FormGroup style={{ width: "70%" }}>
                                <label
                                    htmlFor='responsibles'
                                    style={{ display: 'block' }}
                                >
                                    Responsables Tâche
                                </label>
                                <Controller
                                    name="responsibles"
                                    control={control}
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
                            <FormGroup style={{ width: "70%" }}>
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
                        </Col>
                    </Row>

                    <Row className="justify-content-between pt-2" style={{ borderTop: '1px solid #ddd' }}>
                        <Col lg={8} md={8} sm={8} xs={12}>
                            <FormGroup style={{ borderRight: '1px solid #ddd' }}>
                                <label
                                    style={{ display: 'block' }}
                                >
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                    &nbsp;
                                    {`Checklist ${task.checklist.length ? Math.floor(task.checklist.filter(c => c.done).length / task.checklist.length * 100) : 0} %`}
                                </label>
                                <progress className="d-block w-50" style={{ height: 20 }} value={(task.checklist.filter(c => c.done).length / task.checklist.length) * 100} max="100" />
                                {
                                    task.checklist.map((check) => {
                                        return (
                                            <div key={`check-${check.id}`}>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={check.done === 1}
                                                    onChange={(event) => {
                                                        updateChecklist(task.tableId, task.id, check.id, check.label, event.target.checked ? 1 : 0)
                                                    }}
                                                />
                                                &nbsp;
                                                <span style={{ position: "absolute", zIndex: -9999, opacity: 0 }}>{check.label}</span>
                                                <input
                                                    type="text"
                                                    defaultValue={check.label}
                                                    className="input-checklist-name"
                                                    style={{
                                                        width: check.label.length * (8 - check.label.length / 40),
                                                        textDecoration: check.done ? 'line-through' : 'none',
                                                        color: check.done ? 'grey' : 'black'
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            (event.target as HTMLInputElement).blur()
                                                        }
                                                    }}
                                                    onBlur={async (event) => {
                                                        if (event.target.value === "") {
                                                            event.target.value = check.label
                                                        } else {
                                                            if (event.target.value !== check.label) {
                                                                updateChecklist(task.tableId, task.id, check.id, event.target.value, check.done)
                                                            }
                                                        }
                                                    }}
                                                />&nbsp;
                                                <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteChecklist(task.tableId, task.id, check.id)} />
                                            </div>
                                        )
                                    })
                                }
                                <button type="button" className="btn btn-success mt-3" onClick={() => addChecklist(task.tableId, task.id)}>Ajouter un élément</button>
                            </FormGroup>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                            <FormGroup>
                                <label
                                    style={{ display: 'block' }}
                                >
                                    <FontAwesomeIcon icon={faPaperclip} />
                                    &nbsp;
                                    Pièces jointes
                                </label>
                                {
                                    task.files.map(pj =>
                                        <div key={`pj-${pj.id}`}>
                                            <a href={`${process.env.REACT_APP_PUBLIC_URL}/${pj.path}`} target="_blank">
                                                <FontAwesomeIcon icon={faFile} />
                                            </a>
                                            &nbsp;
                                            {pj.label}
                                            &nbsp;
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteFile(task.tableId, task.id, pj.id)} />
                                        </div>
                                    )
                                }
                                <DropZone
                                    maxSize={4}
                                    fileType={["JPG", "PNG", "PDF", "XLSX", "CSV", "DOCX", "TXT"]}
                                    onHandleFile={(file: File) => addFile(task.tableId, task.id, file)}
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
                </Col>

                

                <Col md={3} lg={3} style={{ borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column', height: 500, overflow: 'auto', background: '#f1f1f1' }}>
                    <h3 className="mt-2">
                        Conversation
                    </h3>
                    {
                        task.conversation.map(conversation => <ChatBubble conversation={conversation} />)
                    }
                    <div style={{ marginTop: 'auto' }}>
                        <CharactersCounter
                            actualValue={comment}
                            maxCharacter={150}
                            inputRender={(max: number) => <textarea
                                autoComplete='off'
                                maxLength={max}
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                className={`text-input form-control ${errors.title ? 'text-input-error' : 'text-input'}`}
                                style={{ resize: 'none' }}
                            />}
                        />
                        <button type="button" className='btn btn-primary mb-2' style={{ marginLeft: 'auto', display: 'block' }} onClick={handleAddComment}>
                            <FontAwesomeIcon icon={faComment} />
                        </button>
                    </div>
                </Col>

            </Row>
            
            <Row>
                <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => {
                            setValue('archived', archivedView ? 0 : 1)
                        }}
                        type="submit"
                        className='btn btn-secondary'
                        style={{ margin: '6px' }}
                    >
                        { archivedView ? 'Désarchiver': 'Archiver' }
                    </button>
                    <button
                        type="submit"
                        className='btn btn-primary'
                        disabled={!!(errors.title)}
                        style={{ margin: '6px' }}
                    >
                        Enregistrer
                    </button>
                </Col>
            </Row>
        </form>
    )
}

const ChatBubble = ({ conversation }: { conversation: AsConversation }) => {
    return (
        <div className="card" style={{ padding: 10 }}>
            <div style={{ marginBottom: 10, display: 'flex' }}>
                <img
                    src={`${PUBLIC_URL}/${conversation.user.url}`}
                    width="26"
                    height="26"
                    className="rounded-circle imgResponsible"
                    onError={(event) => (event.target as HTMLImageElement).src = DefaultAvatar}
                    alt="Avatar"
                />
                &nbsp;
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: 'black', marginTop: -4 }}>
                        {`${conversation.user.first_name} ${conversation.user.last_name}`}
                    </span>
                    <span style={{ fontSize: 11, marginTop: -3, fontStyle: 'italic', color: '#898989' }}>
                        <Tooltip title={moment(conversation.createdAt).calendar()} arrow>
                            <span>
                                {moment(conversation.createdAt).calendar()}
                            </span>
                        </Tooltip>
                    </span>
                </span>
            </div>

            <span style={{ color: '#4a4a4a' }}>{conversation.text}</span>
        </div>
    );
}
