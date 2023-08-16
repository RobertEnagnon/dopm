import React, { ChangeEvent, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Grid/*, TableFooter*/, Typography } from "@material-ui/core";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import moment from "moment";
import { Fiche } from "../../../models/fiche";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

type StickyHeadTableProps = {
  periode: string,
  titleChange: Function,
  propsFiches: Array<Fiche>
}

const columns: Array<{ id: string, label: string, minWidth: number, align?: "left" | "right" | "inherit" | "center" | "justify", format?: Function }> = [
  { id: "id", label: "Id", minWidth: 170 },
  {
    id: "sender",
    label: "Emetteur",
    minWidth: 170,
  },
  {
    id: "cat",
    label: "categorie",
    minWidth: 170,
  },
  { id: "service", label: "Service", minWidth: 170 },

  {
    id: "team",
    label: "Equipe",
    minWidth: 170,
    // format: (value) => value.toFixed(2),
  },
  {
    id: "respSec",
    label: "Responsable sécurite",
    minWidth: 170,
    // format: (value) => value.toFixed(2),
  },
  {
    id: "respCons",
    label: "Responsable conservation",
    minWidth: 170,
    // format: (value) => value.toFixed(2),
  },
  {
    id: "zone",
    label: "Lieu",
    minWidth: 170,
    // format: (value) => value.toFixed(2),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    // format: (value) => value.toFixed(2),
  },
  /*{
    id: "deadline",
    label: "Date de limite",
    minWidth: 170,
    // format: (value) => moment(value).format("DD-MM-YYYY H:mm"),
  },*/
  {
    id: "formattedCreatedAt",
    label: "Date de création",
    minWidth: 170,
    // format: (value) => moment(value).format("DD-MM-YYYY H:mm"),
  },
];
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const years = [
  2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,
];

type FicheTableCell = Omit<Fiche, "id" | "service" | "team" | "zone"> & {
  id: string,
  service?: string,
  team?: string,
  zone?: string,
}

export default function StickyHeadTable({ periode, titleChange, propsFiches }: StickyHeadTableProps) {
  const { t } = useTranslation();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [days, setDays] = useState<Array<string>>([]);
  const [day, setDay] = useState<number>(new Date().getDate());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [fiches, setFiches] = useState<Array<FicheTableCell>>([]);
  const [filtredFiches, setFiltredFiches] = useState<Array<FicheTableCell>>([]);

  useEffect(() => {
    const mappedResult = propsFiches.map((f: Fiche) => {
      return {
        id: `${f.id}-${new Date(f.createdAt).getFullYear()}`,
        sender: `${f.senderFirstname} ${f.senderLastname}`,
        cat: f.FSCategory?.name,
        service: typeof f.service === "object" ? f.service?.name : f.service,
        team: typeof f.team === "object" ? f.team?.name : f.team,
        status: f.status,
        respSec: `${f.responsibleSecurite?.firstname || ""} ${f.responsibleSecurite?.lastname || ""
          }`,
        respCons: `${f.responsibleConservatoire?.firstname || ""} ${f.responsibleConservatoire?.lastname || ""
          }`,
        zone: typeof f.zone === "object" ? `${f.zone?.name} ${f.subzone?.name}` : f.zone,
        deadLine: f.deadLineConservatoire
          ? moment(new Date(f.deadLineConservatoire)).format(
            "DD-MM-YYYY H:mm"
          )
          : "",
        createdAt: new Date(f.createdAt),
        formattedCreatedAt: f.createdAt
          ? moment(new Date(f.createdAt)).format("DD-MM-YYYY H:mm")
          : "",
      };
    });

    setFiches(mappedResult);
    switch (periode) {
      case "journalier":
        titleChange(t("dashboard.tablefsdaily"));
        break;
      case "mensuel":
        titleChange(t("dashboard.tablefsmonthly"));
        break;
      case "annuel":
        titleChange(t("dashboard.tablefsannual"));
        break;

      default:
        break;
    }
  }, []);

  const getDays = (date: Date) => {
    let lastDay =
      new Date(date.getFullYear(), date.getMonth() + 1, -1).getDate() + 1;
    let d = [];

    for (let i = 1; i < lastDay + 1; i++) {
      d.push(`${("0" + i).slice(-2)}`);
    }
    return d;
  };
  useEffect(() => {
    setDays(getDays(new Date(year, month)));
  }, [month]);
  useEffect(() => {
    // Filter
    if (fiches) {
      const date = new Date(year, month, day);
      if (periode === "journalier") {
        const newFiches = fiches.filter((f) => {
          return (
            new Date(f.createdAt).getDate() === date.getDate() &&
            new Date(f.createdAt).getMonth() === date.getMonth() &&
            new Date(f.createdAt).getFullYear() === date.getFullYear()
          );
        });

        setFiltredFiches(newFiches);
      }
      if (periode === "mensuel") {
        {
          const newFiches = fiches.filter((f) => {
            return (
              new Date(f.createdAt).getMonth() === date.getMonth() &&
              new Date(f.createdAt).getFullYear() === date.getFullYear()
            );
          });
          setFiltredFiches(newFiches);
        }
      }
      if (periode === "annuel") {
        {
          const newFiches = fiches.filter((f) => {
            return new Date(f.createdAt).getFullYear() === date.getFullYear();
          });
          setFiltredFiches(newFiches);
        }
      }
      setPage(0);
    }
  }, [day, month, year, fiches]);

  const handleSelectMonth = (m: number) => {
    setMonth(m);
  };
  const handleSelectYear = (y: number) => {
    setYear(y);
  };
  const handleSelectDay = (d: number) => {
    setDay(d);
  };
  const handleChangePage = (event: React.MouseEvent | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
    setRowsPerPage(+(event?.target?.value || 0));
    setPage(0);
  };

  const stylesFiches = (status: string) => {
    if (status === "Nouvelle") {
      return {

        background: "rgb(255 255 255)",
        boxShadow: "5px 5px 5px rgb(68 68 68 / 60%)",

      };
    } else if (status === "En cours") {
      return {
        background: "rgb(255 152 0 / 53%)",
      };
    } else if (status === "Cloturée") {
      return {
        background: "rgb(139 195 74 / 53%)",
      };
    } else if (status === "Non FS") {
      return {
        background: "rgb(158 158 158 / 72%)",
      };
    } else {
      return {
        background: "gold"
      };
    }
  }
  return (
    <div className={`${styles.vwrapper} h-100 w-100`}>
      <Grid
        item
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        {periode === "journalier" && (
          <Grid item>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{
                  fontSize: "0.9em",
                  padding: "0",
                  marginRight: "6px",
                }}
              >
                {day}
              </DropdownToggle>
              <DropdownMenu end>
                {days.map((d, i) => {
                  return (
                    <DropdownItem
                      key={i}
                      onClick={() => {
                        // handleSelectMonth(i);
                        handleSelectDay(parseInt(d));
                      }}
                    >
                      {d}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Grid>
        )}
        {(periode === "mensuel" || periode === "journalier") && (
          <Grid item>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{
                  fontSize: "0.9em",
                  padding: "0",
                  marginRight: "6px",
                }}
              >
                {months[month]}
              </DropdownToggle>
              <DropdownMenu end>
                {months.map((m, i) => {
                  return (
                    <DropdownItem
                      key={i}
                      onClick={() => {
                        handleSelectMonth(i);
                      }}
                    >
                      {t("services." + m)}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Grid>
        )}
        <Grid item>
          <UncontrolledDropdown className="d-inline-block">
            <DropdownToggle
              caret
              color="White"
              style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
            >
              {year}
            </DropdownToggle>

            <DropdownMenu end>
              {years.map((y, i) => {
                return (
                  <DropdownItem
                    key={i}
                    onClick={() => {
                      handleSelectYear(y);
                    }}
                  >
                    {y}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Grid>
      </Grid>
      {filtredFiches?.length > 0 ? (
        <>
          <div className={styles.contentBody}>
            <TableContainer className={styles.tableContainer}>
              <Table stickyHeader className={styles.table}>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtredFiches
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                          style={stylesFiches(row.status || '')}
                        >
                          {columns.map((column) => {
                            // @ts-ignore
                            const value = row[column.id] || null;
                            return (
                              <TableCell key={column.id} align={column.align ? column.align : 'left'}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filtredFiches.length}
            className="w-100"
            rowsPerPage={rowsPerPage}
            page={filtredFiches.length <= 0 ? 0 : page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography align="center" variant="h5">
          Aucune fiche trouvée dans la periode selectionnée
        </Typography>
      )}
    </div>
  );
}
