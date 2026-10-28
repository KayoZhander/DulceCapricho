import { useEffect, useState } from "react";

export default function CuadroInput({
	label,
	nameId,
	placeholder,
	value,
	required = false,
	onChange = null,
	onInput = null,
	/*
		las validaciones deben ir así:
		[(valor) => { validación (debe retornar un true o false) }, "mensaje de error"]

		ejemplo: [
			[(x) => { return x > 0; }, "Valor debe ser mayor a 0."],
			[(x) => { return x < 100; }, "Valor debe ser menor a 100."]
		]
	*/
	max = undefined,
	min = undefined,
	validaciones = [],
	error,
	setError
}) {
	if (required) {
		validaciones = [[
			v => v.trim().length > 0, "Este campo es obligatorío."
		]].concat(validaciones);
	}
	if (max) {
		if (typeof max !== "number")
			throw new Error("'max' debe ser de tipo númerico");
		else if (min && min >= max)
			throw new Error("rango de limite minimo y maximo no es valido");
		validaciones = [[
			v => v.trim().length > max, `No debe sobrepasar los ${max} caracteres.`
		]].concat(validaciones);
	}
	if (min) {
		if (typeof min !== "number")
			throw new Error("'min' debe ser de tipo númerico");
		else if (!required)
			throw new Error("no puedes especificar un limite minimo si no es obligatorio");
		else if (max && min >= max)
			throw new Error("rango de limite minimo y maximo no es valido");
		validaciones = [[
			v => v.trim().length > min, `Debe tener al menos ${min} caracteres.`
		]].concat(validaciones);
	}

	function _onInput(e) {
		onInput?.(e);
		setError(null);
		for (const v of validaciones) {
			if (!v[0](e.target.value)) {
				setError(v[1]);
				break;
			}
		}
	}

	return (<>
		<div className="form-group">
			<label
				htmlFor={nameId}
				style={error ? { color: "var(--danger)" } : {}}
			>{error ? error : label}</label>
			<input
				id={nameId}
				name={nameId}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onInput={_onInput}
				style={error ? { border: "1px solid var(--danger)" } : {}}
			></input>
		</div>
	</>);
}
