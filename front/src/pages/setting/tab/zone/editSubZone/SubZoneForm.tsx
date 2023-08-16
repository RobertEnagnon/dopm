import { Modal } from "react-bootstrap";
import { Input } from "reactstrap";
import { SchemaOf } from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from "react-hook-form";

type EditZoneType = {
  name: string
}

export const Form = (props: { onSubmit: SubmitHandler<EditZoneType>, validationSchema: SchemaOf<EditZoneType>, initialValues: EditZoneType }) => {
  const {
    onSubmit,
    validationSchema,
    initialValues
  } = props;

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<EditZoneType>({
    resolver: yupResolver(validationSchema)
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <label htmlFor="subZoneName" style={{ display: "block" }}>
            Nom
          </label>
          <Controller
            name="name"
            control={control}
            defaultValue={initialValues.name}
            render={({ field }) => <Input
              required={true}
              autoComplete="off"
              type="text"
              id="subZoneName"
              {...field}
            />}
          />
          {errors.name && (
            <div className="input-feedback">{errors.name.message}</div>
          )}

          <button type="submit" className="btn btn-primary" disabled={(errors.name) ? true : false}>
            Enregistrer
          </button>
        </Modal.Body>
      </form>
    </>
  );
};
