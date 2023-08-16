import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Col, FormGroup, Input } from "reactstrap";
import styles from "../index.module.css";
import { DeepRequired, FieldErrorsImpl, Controller, UseFormWatch, Control } from "react-hook-form";
import { FicheInfAdd } from "../../../../models/ficheinf";

type St = {
  name: string,
  bg: string,
  color: string
}
const status: St[] = [
  {
    name: "Nouvelle",
    bg: "#efefef",
    color: "black"
  },
  {
    name: "En cours",
    bg: "#ff9800",
    color: "white"
  },
  {
    name: "Cloturée",
    bg: "#8bc34a",
    color: "white"
  },
  {
    name: "Non FS",
    bg: "#9e9e9e",
    color: "white"
  }
]

const Status = (props: { watch: UseFormWatch<FicheInfAdd>, control: Control<FicheInfAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>, submitted: boolean, setValue: Function, values: FicheInfAdd }) => {
  
  const {
    control,
    errors,
    submitted,
    values,
    setValue,
    watch
  } = props;
  
  const [actualStatus, setActualStatus] = useState<St>(
    status.filter(s => s.name === props.values.status).length === 1? (
    status.filter(s => s.name === props.values.status)[0]): (
    {
      name: values.status? values.status: '',
      bg: '#fff',
      color: '#000'
    })
  )
  useEffect(() => {
    setValue("status", values.status)
    setValue("commentaireStatus", values.commentaireStatus)
  }, [values]);

  useEffect(() => {
    if (watch("status")) {
      setActualStatus(() => {
        return status.filter(s => s.name === watch("status"))[0]
      })
    }
  }, [watch("status")])

  return (
    <Grid
      item
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      xs={12}
    >
      <Grid item xs={6} md={3}>
        <FormGroup>
          <Col>
            <label
              htmlFor="status"
              className="label"
              style={{ display: "block" }}
            >
              Status
            </label>
            <Controller
              name="status"
              control={control}
              defaultValue={values.status}
              render={({ field }) => <select
                className="form-select"
                id="status"
                style={{
                  display: "block",
                  backgroundColor: actualStatus.bg,
                  color: actualStatus.color
                }}
                {...field}
              >
                <option
                  value=""
                  style={{
                    backgroundColor: "#FFF",
                    color: "black",
                  }}
                >
                  Select status
                </option>
                {status.map((s) => {
                  return (
                    <option
                      value={s.name}
                      style={{
                        backgroundColor: s.bg,
                        color: s.color
                      }}
                    >
                      {s.name}
                    </option>
                  );
                })}
              </select>}
            />
            {errors.status && submitted && (
              <div className={styles.inputFeedback}>
                {errors.status.message}
              </div>
            )}
          </Col>
        </FormGroup>
      </Grid>
      {(watch("status") === "En cours" ||
        watch("status") === "Cloturée") && (
          <Grid item xs={12} md={4}>
            <FormGroup>
              <Col>
                <label
                  htmlFor="commentaireStatus"
                  className="label"
                  style={{ display: "block" }}
                >
                  {watch("status") === "En cours"
                    ? "Action retenue"
                    : " Action réalisée"}
                </label>
                <Controller
                  name="commentaireStatus"
                  control={control}
                  defaultValue={values.commentaireStatus || ""}
                  render={({ field }) => <Input
                    autoComplete="off"
                    type="text"
                    id="commentaireStatus"
                    className={
                      errors.commentaireStatus &&
                        submitted
                        ? "text-input error"
                        : "text-input"
                    }
                    {...field}
                  />}
                />
                {errors.commentaireStatus &&
                  submitted && (
                    <div className={styles.inputFeedback}>
                      {errors.commentaireStatus.message}
                    </div>
                )}
              </Col>
            </FormGroup>
          </Grid>
        )}
    </Grid>
  );
}

export default Status;
