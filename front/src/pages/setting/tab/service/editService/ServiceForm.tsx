import { FormGroup, Input } from "reactstrap";
import "../index.css";
import { SchemaOf } from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from "react-hook-form";

type ServiceEditType = {
  name: string,
  description?: string,
}

export const Form = (props: { onSubmit: SubmitHandler<ServiceEditType>, validationSchema: SchemaOf<ServiceEditType>, initialValues: ServiceEditType }) => {
  const {
    onSubmit,
    validationSchema,
    initialValues
  } = props;

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ServiceEditType>({
    resolver: yupResolver(validationSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <label htmlFor="serviceName" style={{ display: "block" }}>
          Nom
        </label>
        <Controller
          name="name"
          control={control}
          defaultValue={initialValues.name}
          render={({ field }) => <Input
            autoComplete="off"
            type="text"
            id="serviceName"
            className={
              errors.name
                ? "text-input error"
                : "text-input"
            }
            {...field}
          />}
        />

        {errors.name && (
          <div className="input-feedback">{errors.name.message}</div>
        )}
      </FormGroup>

      <FormGroup>
        <label htmlFor="serviceDescription" style={{ display: "block" }}>
          Description
        </label>
        <Controller
          name="description"
          control={control}
          defaultValue={initialValues.description}
          render={({ field }) => <Input
            autoComplete="off"
            rows={4}
            type="textarea"
            id="serviceDescription"
            className={
              errors.description
                ? "text-input error"
                : "text-input"
            }
            {...field}
          />}
        />

        {errors.description && (
          <div className="input-feedback">{errors.description.message}</div>
        )}
      </FormGroup>

      <button type="submit" className="btn btn-primary" disabled={(errors.name || errors.description) ? true : false}>
        Enregistrer
      </button>
    </form>
  );
};
