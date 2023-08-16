import { Row, Col, Table } from "reactstrap";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/fr";

import { Version } from "../../../models/version";
import NewVersion, { defaultVersion } from "./newVersion";
import versionServices from "../../../services/version";
import { notify, NotifyActions } from "../../../utils/dopm.utils";

const VersionTab = () => {
  const [versions, setVersions] = useState<Version[]>([]);

  // Ajouter la nouvelle version à la liste des versions
  // du Component parent
  const handleNewVersion = (version: Version): void => {
    let newVersions: Version[] = [...versions];
    newVersions.push(version);
    setVersions(newVersions);
  };

  // Editer une version
  const handleUpdateVersion = (version: Version): void => {
    console.log("version", version);
    let newVersions: Version[] = [...versions];
    const index = versions.findIndex((v) => v.id === version.id);
    if (index > -1) {
      newVersions[index] = version;
      setVersions(newVersions);
    }
  };

  // Supprimer une version
  const onDelete = async (value: number) => {
    const res = await versionServices.DeleteVersion(value);
    if (res && res.status == 201) {
      setVersions(versions.filter((v: Version) => v.id != value));
      notify(
        "Version supprimée de la base de données",
        NotifyActions.Successful
      );
    } else
      notify(
        "Impossible de supprimer la version de la base de données",
        NotifyActions.Error
      );
  };

  // Récupérer les versions depuis la base de données
  // et les stocker dans la var versions
  useEffect(() => {
    async function getVersions() {
      const res = await versionServices.GetAllVersion();
      if (!res || res.status != 201) {
        notify(
          "Impossible de récupérer la liste des versions",
          NotifyActions.Error
        );
        return;
      }

      const versions = res.data.map((d: any) => ({
        id: d.id,
        name: d.name,
        date: d.date,
        features: d.features.map((f: any) => f.name),
      }));

      setVersions(versions);
    }

    getVersions();
  }, []);

  return (
    <>
      {/* Table des versions */}
      <>
        <Row className="mb-4 align-items-end">
          <Col>
            <h6 className="card-subtitle text-muted">
              Gestion des <code>versions</code>.
            </h6>
          </Col>
          {/* Bouton de création de nouvelle version */}
          <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
            <NewVersion
              version={defaultVersion}
              onNewVersion={handleNewVersion}
              buttonElement="Nouvelle version"
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Table striped hover>
              <thead>
                <th>Nom</th>
                <th>Date de création</th>
                <th>Nouveautés</th>
                <th></th>
              </thead>
              <tbody>
                {versions?.map((version, index) => {
                  return (
                    <tr key={index}>
                      <td>{version.name}</td>
                      <td>
                        {version.date
                          ? moment(
                              typeof version.date === "string"
                                ? new Date(version.date)
                                : version.date,
                              "DD-MM-YYYY"
                            ).format("DD-MM-YYYY")
                          : null}
                      </td>
                      <td>
                        {version.features.map((v) => (
                          <p>{v}</p>
                        ))}
                      </td>
                      <td>
                        <div className="d-flex flex-row justify-content-center align-items-center">
                          {/* Edition de version*/}
                          <NewVersion
                            version={version}
                            onUpdateVersion={handleUpdateVersion}
                            buttonElement={
                              <FontAwesomeIcon
                                icon={faPen}
                                style={{ cursor: "pointer" }}
                                className="align-middle mr-3"
                              />
                            }
                          />

                          {/* Suppression de version */}
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ cursor: "pointer" }}
                            className="align-middle"
                            onClick={() => {
                              onDelete(version.id);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    </>
  );
};

export default VersionTab;
