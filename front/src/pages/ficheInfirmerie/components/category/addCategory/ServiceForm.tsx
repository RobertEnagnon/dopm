import { FormGroup, Input } from "reactstrap";
import "../index.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { SchemaOf } from "yup";
import { Checkbox } from "@material-ui/core";

type CategoryAddType = {
    name: string,
    isInjuredCategoryName: boolean
}

export const Form = (props: { onSubmit: SubmitHandler<CategoryAddType>, validationSchema: SchemaOf<{name: string}>, initialValues: CategoryAddType, addText?: boolean }) => {
    const {
        onSubmit,
        validationSchema,
        initialValues,
        addText
    } = props;

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CategoryAddType>({
        resolver: yupResolver(validationSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
                <label htmlFor="categoryName" style={{ display: "block" }}>
                    Nom
                </label>
                <Controller
                    name="name"
                    control={control}
                    defaultValue={initialValues.name}
                    render={({ field }) => <Input
                        autoComplete="off"
                        type="text"
                        id="categoryName"
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

            {addText && (
                <FormGroup>
                    <label htmlFor="isInjuredCategoryName" style={{ display: "inline" }}>
                        Ajouter un champ texte
                    </label>
                    <Controller
                        name="isInjuredCategoryName"
                        control={control}
                        defaultValue={initialValues.isInjuredCategoryName}
                        render={({ field }) => <Checkbox
                            id="isInjuredCategoryName"
                            color="primary"
                            {...field}
                        />}
                    />
                </FormGroup>
            )}

            <button type="submit" className="btn btn-primary" disabled={(errors.name) ? true : false}>
                Enregister
            </button>
        </form>
    );
};
