import { FormGroup, Input } from "reactstrap";
import "../index.css";
import { SchemaOf } from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm, Controller, SubmitHandler } from "react-hook-form";

type ResponsibleAddType = {
	firstname: string,
	lastname: string,
	email: string
}

export const Form = (props: { onSubmit: SubmitHandler<ResponsibleAddType>, validationSchema: SchemaOf<ResponsibleAddType>, initialValues: ResponsibleAddType }) => {
	const {
		onSubmit,
		validationSchema,
		initialValues
	} = props;

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<ResponsibleAddType>({
		resolver: yupResolver(validationSchema)
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormGroup>
				<label htmlFor="firstname" style={{ display: "block" }}>
					Prénom
				</label>
				<Controller
					name="firstname"
					control={control}
					defaultValue={initialValues.firstname}
					render={({ field }) => <Input
						autoComplete="off"
						type="text"
						id="firstname"
						className={
							errors.firstname
								? "text-input error"
								: "text-input"
						}
						{...field}
					/>}
				/>

				{errors.firstname && (
					<div className="input-feedback">{errors.firstname.message}</div>
				)}
			</FormGroup>

			<FormGroup>
				<label htmlFor="lastname" style={{ display: "block" }}>
					Nom
				</label>
				<Controller
					name="lastname"
					control={control}
					defaultValue={initialValues.lastname}
					render={({ field }) => <Input
						autoComplete="off"
						type="text"
						id="lastname"
						className={
							errors.lastname
								? "text-input error"
								: "text-input"
						}
						{...field}
					/>}
				/>

				{errors.lastname && (
					<div className="input-feedback">{errors.lastname.message}</div>
				)}
			</FormGroup>
			<FormGroup>
				<label htmlFor="email" style={{ display: "block" }}>
					Email
				</label>
				<Controller
					name="email"
					control={control}
					defaultValue={initialValues.email}
					render={({ field }) =>
						<Input
							autoComplete="off"
							type="text"
							id="email"
							className={
								errors.email ? "text-input error" : "text-input"
							}
							{...field}
						/>}
				/>

				{errors.email && (
					<div className="input-feedback">{errors.email.message}</div>
				)}
			</FormGroup>
			<button type="submit" className="btn btn-primary" disabled={(errors.firstname || errors.lastname || errors.email) ? true : false}>
				Enregistrer
			</button>
		</form>
	);
};
