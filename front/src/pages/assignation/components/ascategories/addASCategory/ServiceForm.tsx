import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { SchemaOf } from "yup"; import { FormGroup, Input } from "reactstrap";
import '../index.css';
import { Color, Colors } from "../../../../../utils/dopm.utils";

type CategoryAddType = {
    name: string,
    color?: string
}

export const Form = (props: { onSubmit: SubmitHandler<CategoryAddType>, validationSchema: SchemaOf<CategoryAddType>, initialValues: CategoryAddType }) => {
    const {
        onSubmit,
        validationSchema,
        initialValues
    } = props;

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<CategoryAddType>({
        resolver: yupResolver(validationSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
                <label htmlFor='atcategoryName' style={{ display: 'block' }}>
                    Nom
                </label>
                <Controller
                    name="name"
                    control={control}
                    defaultValue={initialValues.name}
                    render={({ field }) => <Input
                        autoComplete='off'
                        type='text'
                        id='atcategoryName'
                        className={
                            errors.name
                                ? 'text-input-error'
                                : 'text-input'
                        }
                        {...field}
                    />}
                />

                {errors.name && (
                    <div className='input-feedback'>{errors.name.message}</div>
                )}
            </FormGroup>

            <FormGroup>
                <label htmlFor='color' style={{ display: 'block' }}>
                    Couleur
                </label>
                <Controller
                    name="color"
                    control={control}
                    defaultValue={initialValues.color}
                    render={({ field }) => <Input
                        type='select'
                        id='color'
                        className='select-input'
                        style={{ backgroundColor: watch('color') || initialValues.color, color: Color.white }}
                        {...field}
                    >
                        {Colors.map((color, index) => {
                            return (
                                <option
                                    key={`color${index}`}
                                    value={color.value}
                                    style={{
                                        backgroundColor:`${color.value}`,
                                        color: Color.white,
                                    }}
                                >
                                    {color.name}
                                </option>
                            );
                        })}
                    </Input>
                    }
                />
            </FormGroup>

            <button type='submit' className='btn btn-primary' disabled={(errors.name || errors.color) ? true : false}>
                Enregistrer
            </button>
        </form>
    )
}