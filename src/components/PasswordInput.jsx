import { useState } from "react";

const espacioRegex = /[^\w\p{P}\p{S}]+/gu;

export default function PasswordInput({
	label,
	nameId,
	placeholder,
	value,
	required = false,
	onChange = null,
	onInput = null,
	min = 8,
	max = 30,
	validaciones = [],
	error,
	setError
}) {
	const [mostrarPassword, setMostrarPassword] = useState(false);

	const validacionesDefault = [
		[(valor) => !required || valor.trim().length > 0, "Este campo es obligatorio."],
		[(valor) => valor.length >= min, `Debe tener al menos ${min} caracteres.`],
		[(valor) => valor.length <= max, `No debe superar los ${max} caracteres.`],
	];

	const todasValidaciones = [...validacionesDefault, ...validaciones];

	function manejarInput(e) {
		const valorSinEspacios = e.target.value.replace(espacioRegex, "");
		if (valorSinEspacios !== e.target.value) {
			e.target.value = valorSinEspacios;
		}
		onInput?.(e);
		setError?.(null);
		for (const validacion of todasValidaciones) {
			if (!validacion[0](e.target.value)) {
				setError?.(validacion[1]);
				break;
			}
		}
	}

	return (
		<div className="form-group">
			<label htmlFor={nameId} style={error ? { color: "var(--danger)" } : {}}>
				{error ? error : label}
			</label>
			<div className="password-input-wrap">
				<input
					id={nameId}
					name={nameId}
					type={mostrarPassword ? "text" : "password"}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onInput={manejarInput}
					style={error ? { border: "1px solid var(--danger)" } : {}}
				/>
				<button
					type="button"
					className="password-toggle-inline"
					onClick={() => setMostrarPassword((prev) => !prev)}
				>
					{mostrarPassword ? "Ocultar" : "Mostrar"}
				</button>
			</div>
		</div>
	);
}
