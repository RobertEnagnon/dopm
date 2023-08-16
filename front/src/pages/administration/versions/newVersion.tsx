import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import 'moment/locale/fr'

import { Version, formatDate } from "../../../models/version"
import Feature from './feature'
import versionServices from "../../../services/version"
import { notify, NotifyActions } from "../../../utils/dopm.utils"


//----------------------------------------------------------------
// Composant : NewVersion
// Il s'agit d'un bouton "Nouvelle version" qui ouvre un dialogue
// modal qui permet de créer une nouvelle version et de modifier
// son nom et ses features
//----------------------------------------------------------------
interface NewVersionProps {
    version: Version,
    onNewVersion?: (_version: Version) => void,
    onUpdateVersion?: (_version: Version) => void,
    buttonElement?: React.ReactElement<any, any> | string
}

// Version utilisée lorsqu'on en crée une nouvelle
const defaultVersion: Version = {
    id: 0,
    name: "",
    date: moment().locale('fr').format('Do MMMM YYYY'),
    features: [""]
};

const NewVersion = ({ onNewVersion, onUpdateVersion, version: versionProps, buttonElement }: NewVersionProps) => {

    let [show, setShow] = useState<boolean>(false)
    let [version, setVersion] = useState<Version>(versionProps);

    // S'il faut désactiver ou non le bouton de validation
    const canValidate = () => {
        if (version.features.findIndex(f => f === "") > -1 ||
            !version.features.length ||
            version.name === "")
            return true;
        return false;
    }

    // Ajouter la version à la base de données
    const handleNewVersion = async () => {

        const res = await versionServices.PostVersion(version)

        // Fermer le dialogue
        setShow(false)

        if (res && res.status === 201)
            notify("Version ajoutée à la base de données", NotifyActions.Successful)

        else {
            notify("Impossible de créer cette version: est-ce que le numéro de version est unique ?", NotifyActions.Error)
            return;
        }

        // Envoyer un message au parent pour maj les versions
        if (onNewVersion) onNewVersion(res.data.version);
    }

    const handleUpdateVersion = async () => {
        // Maj de la version dans la db
        const res = await versionServices.UpdateVersion(version)

        // Fermer le dialogue
        setShow(false)

        if (res && res.status == 201) {
            notify("Version modifiée", NotifyActions.Successful)
        }
        else {
            notify("Impossible de modifier la version", NotifyActions.Error);
            return;
        }

        // Envoyer un message au parent pour maj les versions
        if (onUpdateVersion) onUpdateVersion(res.data.version)
    }

    // Création d'une nouvelle feature
    const handleNewFeature = () => {
        let newVersion = { ...version }
        newVersion.features.push("");
        setVersion(newVersion)
    }

    // Edition d'une feature
    const handleChange = (index: number, value: string) => {
        let newVersion = { ...version }
        newVersion.features[index] = value;
        setVersion(newVersion)
    }

    // Suppression d'une feature
    const handleDelete = (i: number) => {
        let newFeatures = { ...version }
        newFeatures.features.splice(i, 1)
        setVersion(newFeatures)
    }
    
    return (
        <>
            <Button
                variant={typeof buttonElement === "string" ? "success px-2" : ""}
                onClick={() => setShow(true)}>
                {buttonElement}
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Gestion des versions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="versionNumber">
                            <Form.Label>Numéro de version :</Form.Label>
                            <Form.Control
                                value={version.name}
                                placeholder="v3.0.1 .."
                                onChange={e => {
                                    let newVersion = { ...version }
                                    newVersion.name = e.target.value;
                                    setVersion(newVersion)
                                }}
                                autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="versionDate">
                            <Form.Label>Date :</Form.Label>
                            <Form.Control
                                value={formatDate(version.date)}
                                readOnly />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="features">
                            <Form.Label>Nouvelles features :
                                <FontAwesomeIcon
                                    icon={faCirclePlus}
                                    fixedWidth
                                    className="align-middle m-2"
                                    size="lg"
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleNewFeature} />
                            </Form.Label>
                            {version.features.map((f, i) => {
                                return <Feature
                                    key={i}
                                    index={i}
                                    value={f}
                                    onChange={handleChange}
                                    onDelete={handleDelete} />;
                            })}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger px-2"
                        onClick={() => {
                            setShow(false);
                            setVersion(versionProps);
                        }}>
                        Annuler
                    </Button>
                    <Button
                        variant="success px-2"
                        disabled={canValidate()}
                        onClick={typeof buttonElement === "string" ? handleNewVersion : handleUpdateVersion}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewVersion;
export { defaultVersion };