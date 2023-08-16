import {
    Col,
    Row,
} from "reactstrap";
import {
    faTableColumns,
    faCog, faPlus, faArchive, faUserTag, faSearch,
    faMagnifyingGlassPlus, faMagnifyingGlassMinus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useParams } from "react-router-dom";
import './navbar.scss';
import Header from "../../../components/layout/header";
import HeaderTitle from "../../../components/layout/headerTitle";
import React, { useLayoutEffect, useState } from "react";
import AddTableForm from "./table/addTable";
import ModalComponent from "../../../components/layout/modal";
import { useAssignation } from "../../../components/context/assignation.context";
import { floatingMonths } from "../../dashboard/GridComponents/services";
import { Select } from "@material-ui/core";
import { Switch } from "@mui/material";
import AddTaskForm from "./task/addTask";
import PDCATask from "./task/readTask";
import EditTaskForm from "./task/editTask";
import { AsTask } from "../../../models/Assignation/asTask";

const hideSearchListWhenOutside = (event: MouseEvent) => {
    const searchList = document.getElementById('searchList')
    if (!searchList?.classList.contains('d-none')) {
        if ((event as any).composedPath().filter((p: HTMLElement) => p.id === 'searchList' || p?.classList?.contains('modal')).length === 0) {
            searchList?.classList.add('d-none')
        }
    }
}

const NavbarAssignation = () => {
    const params = useParams();
    const months = floatingMonths();
    const today = new Date();
    const currentYear = today.getFullYear();
    const years = Array.from({length: 5}, (v, k) => currentYear - 5 + k + 1)
    const location = useLocation();
    const Assignation = useAssignation();
    const {
        addTable,
        addTask,
        archivedView,
        setArchivedView,
        selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear,
        updateDisplayMode,
        tables,
        updateTask
    } = Assignation;

    const [ openAddTable, setOpenAddTable ] = useState<boolean>(false);
    const [ openAddTask, setOpenAddTask ] = useState<boolean>(false);
    const [ openEditTask, setOpenEditTask ] = useState<boolean>(false);
    const [ selectedTask, setSelectedTask ] = useState<AsTask | undefined>(undefined);
    const [ searchTerm, setSearchTerm ] = useState<string>('');

    const AssignationRoutes = [{
        to: `/Assignation/${params.asBoardId}/PDCA`,
        icon: faTableColumns ,
        label: 'PDCA'
    }, {
        to: `/Assignation/${params.asBoardId}/PDCA/responsibles`,
        icon: faUserTag,
        label: 'PDCA par responsable'
    }, {
        to: `/Assignation/${params.asBoardId}/parametres`,
        icon: faCog,
        label: 'Paramètres'
    }]

    const closeModal = (action: 'addTable' | 'addTask' | 'editTask') => {
        switch (action) {
            case 'addTable':
                setOpenAddTable(false);
                break;
            case 'addTask':
                setOpenAddTask(false);
                break;
            case 'editTask':
                setSelectedTask(undefined);
                setOpenEditTask(false);
                break;
        }
    }

    const openModal = (action: 'addTable' | 'addTask' | 'editTask', idTask?: number) => {
        switch (action) {
            case 'addTable':
                setOpenAddTable(true);
                break
            case 'addTask':
                setOpenAddTask(true);
                break
            case 'editTask':
                if (idTask) {
                    setSelectedTask(tables.filter(table => table.tasks.find(task => task.id === idTask))[0].tasks.find(task => task.id === idTask))
                    setOpenEditTask(true);
                }
                break
        }
    }

    useLayoutEffect(() => {
        window.removeEventListener('click', hideSearchListWhenOutside);
        window.addEventListener('click', hideSearchListWhenOutside);
    }, []);

    return (
        <>
            {location.pathname == `/Assignation/${params.asBoardId}/PDCA` &&
                <>
                    <ModalComponent
                        open={openAddTable}
                        hide={() => closeModal('addTable')}
                    >
                        <AddTableForm
                            addTable={addTable}
                            closeModalAdd={() => closeModal('addTable')}
                        />
                    </ModalComponent>
                    <ModalComponent
                        open={openEditTask}
                        hide={()=>closeModal('editTask')}
                    >
                        {
                            selectedTask && <EditTaskForm
                                task={selectedTask}
                                editTask={updateTask}
                                closeModalEdit={()=>closeModal('editTask')}
                            />
                        }
                    </ModalComponent>
                </>
            }
            {
                <ModalComponent
                    open={openAddTask}
                    hide={() => closeModal('addTask')}
                >
                    <AddTaskForm
                        addTask={addTask}
                        closeModalAdd={() => closeModal('addTask')}
                    />
                </ModalComponent>
            }
            <Header >
                <HeaderTitle>
                    <Row style={
                        location.pathname == `/Assignation/${params.asBoardId}/PDCA` ?
                            {marginTop: '-20px', marginBottom:'-10px', justifyContent: 'space-between'}
                            :
                            {marginTop: '-20px', marginBottom:'-10px'}
                        }>
                        <Col md={2} style={{ display: 'flex', flexDirection: 'row' }}>
                            {AssignationRoutes?.map(route=>{
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column' }} title={route.label} key={route.label}>
                                        <Link to={route.to} replace >
                                            <FontAwesomeIcon
                                                color="#FFF"
                                                style={{ fontSize: "0.85em", margin: "4px" }}
                                                icon={route.icon}
                                                className="align-middle"
                                            />
                                        </Link>
                                        {location.pathname === route.to &&
                                            <div
                                                style={{
                                                    content: '',
                                                    borderBottom: '2px solid white',
                                                    width: '10px',
                                                    margin: 'auto',
                                                    borderRadius: '2px'
                                                }}
                                            />
                                        }
                                    </div>
                                )
                            })}
                        </Col>
                        <Col md={location.pathname == `/Assignation/${params.asBoardId}/PDCA` ? 6 : 8} className="text-center">
                            <HeaderTitle>{`Assignation`}</HeaderTitle>
                        </Col>
                        {(location.pathname == `/Assignation/${params.asBoardId}/PDCA` || location.pathname == `/Assignation/${params.asBoardId}/PDCA/responsibles`) &&
                            <Col md={2} className="text-right">
                                <Row style={{ justifyContent: "flex-end" }}>
                                    <div style={{ display: 'flex', position: "relative", justifyContent: "flex-end" }}>
                                        <FontAwesomeIcon
                                            color="#FFF"
                                            style={{fontSize: "0.7em", marginTop: 6}}
                                            icon={faSearch}
                                            className="align-middle"
                                            onClick={(event) => {
                                                const searchList = document.getElementById('searchList');
                                                event.stopPropagation();
                                                searchList?.classList.remove('d-none');
                                                (searchList?.firstChild?.firstChild as HTMLInputElement).focus();
                                            }}
                                        />
                                        <Switch checked={archivedView} onChange={() => setArchivedView(!archivedView)} title="Afficher les archives" />
                                        <FontAwesomeIcon
                                            color={archivedView ? '#28a745' : '#FFF'}
                                            style={{fontSize: "0.85em", margin: "4px"}}
                                            icon={faArchive}
                                            className="align-middle"
                                            onClick={() => {
                                                setArchivedView(!archivedView)
                                            }}
                                            title="Afficher les archives"
                                        />
                                        {
                                            location.pathname == `/Assignation/${params.asBoardId}/PDCA/responsibles`
                                            && (
                                                <>
                                                    <FontAwesomeIcon
                                                        style={{fontSize: "0.85em", margin: "4px"}}
                                                        icon={faMagnifyingGlassPlus}
                                                        className="align-middle"
                                                        onClick={() => {
                                                            updateDisplayMode(true)
                                                        }}
                                                    />
                                                    <FontAwesomeIcon
                                                        style={{fontSize: "0.85em", margin: "4px"}}
                                                        icon={faMagnifyingGlassMinus}
                                                        className="align-middle"
                                                        onClick={() => {
                                                            updateDisplayMode(false)
                                                        }}
                                                    />
                                                    {
                                                        !archivedView && <FontAwesomeIcon
                                                            color="#FFF"
                                                            style={{fontSize: "0.85em", margin: "4px"}}
                                                            icon={faPlus}
                                                            className="align-middle"
                                                            onClick={() => openModal('addTask')}
                                                        />
                                                    }
                                                </>
                                            )
                                        }
                                        {
                                            !archivedView && location.pathname == `/Assignation/${params.asBoardId}/PDCA` && <FontAwesomeIcon
                                                color="#FFF"
                                                style={{fontSize: "0.85em", margin: "4px"}}
                                                icon={faPlus}
                                                className="align-middle"
                                                onClick={() => openModal('addTable')}
                                            />
                                        }
                                    </div>
                                </Row>
                            </Col>
                        }
                    </Row>
                    <Row style={{ justifyContent: "flex-end", marginTop: 10 }}>
                        {
                            archivedView && location.pathname === `/Assignation/${params.asBoardId}/PDCA` && (
                                <>
                                    <Select
                                        style={{color: 'white'}}
                                        value={selectedMonth}
                                        onChange={(event) => setSelectedMonth((event.target as HTMLSelectElement).value)}
                                    >
                                        {
                                            months.sort((a, b) => parseInt(a.number) - parseInt(b.number)).map(month =>
                                                <option style={{
                                                    background: month.number === selectedMonth ? '#3b7ddd' : 'white',
                                                    color: month.number === selectedMonth ? 'white' : 'black'
                                                }} key={month.number} value={month.number}>{month.name}</option>
                                            )
                                        }
                                    </Select>
                                    <Select
                                        style={{color: 'white'}}
                                        value={selectedYear}
                                        onChange={(event) => setSelectedYear((event.target as HTMLSelectElement).value)}
                                    >
                                        {
                                            years.map(year =>
                                                <option style={{
                                                    background: year === parseInt(selectedYear) ? '#3b7ddd' : 'white',
                                                    color: year === parseInt(selectedYear) ? 'white' : 'black'
                                                }} key={year} value={year}>{year}</option>
                                            )
                                        }
                                    </Select>
                                </>
                            )
                        }
                    </Row>
                </HeaderTitle>
                <div id="searchList" className="d-none" tabIndex={0}>
                    <p>
                        <input className="text-input form-control" width="100%" type="text" onChange={(e) => setSearchTerm(e.target.value)}/>
                        <FontAwesomeIcon icon={faSearch} className="searchIconPlaceholder" />
                    </p>
                    {
                        searchTerm !== '' && tables.map(table => table.tasks.map((task) => {
                          if (
                              task.title.toLowerCase().includes(searchTerm.toLowerCase())
                              || task.description.toLowerCase().includes(searchTerm.toLowerCase())
                              || task.estimation.toLowerCase().includes(searchTerm.toLowerCase())
                          ) {
                            return (
                                <p key={'table' + table.id + '-task-' + task.id}>
                                    <PDCATask task={task} openModal={openModal} searchView={true} />
                                </p>
                            )
                          }
                          return null
                        }))
                    }
                </div>
            </Header>
        </>
    )
}

export default NavbarAssignation;
