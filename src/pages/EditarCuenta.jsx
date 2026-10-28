import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarFormatoCorreo } from "../utils/Validacion.mjs";
import CuadroInput from "../components/CuadroInput";
import Boton, { BotonClaro } from "../components/Botones";
import { UsuarioContext } from "../contexts/AuthContext";
import Usuario from "../model/Usuario.mjs";
import "../styles/cuenta.css";

const nombreAsciiRegex = /^[A-Za-z]*$/;

function construirFormulario(usuario) {
	return {
		pnombre: usuario?.pnombre ?? "",
		snombre: usuario?.snombre ?? "",
		apaterno: usuario?.apaterno ?? "",
		amaterno: usuario?.amaterno ?? "",
		correo: usuario?.correo ?? "",
		direccion: usuario?.direccion ?? "",
		telefono: usuario?.telefono ?? "",
	};
}

export default function EditarCuenta() {
	const navigate = useNavigate();
	const { usuario, actualizarUsuario } = useContext(UsuarioContext);
	const [form, setForm] = useState(construirFormulario(null));
	const [errores, setErrores] = useState({});

	useEffect(() => {
		if (!usuario) {
			navigate("/login");
			return;
		}

		setForm(construirFormulario(usuario));
		setErrores({});
	}, [usuario, navigate]);

	function onChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		if (errores[name])
			setErrores((prev) => ({ ...prev, [name]: "" }));
	}

	function onDiscard() {
		if (!usuario)
			return navigate("/login");
		setForm(construirFormulario(usuario));
		setErrores({});
		return navigate("/cuenta");
	}

	function validarFormulario(datos) {
		const validacion = {};
		const nombre = String(datos.pnombre ?? "").trim();
		const segundoNombre = String(datos.snombre ?? "").trim();
		const apellidoPaterno = String(datos.apaterno ?? "").trim();
		const apellidoMaterno = String(datos.amaterno ?? "").trim();
		const correo = String(datos.correo ?? "").trim();
		const telefono = String(datos.telefono ?? "").trim();
		const direccion = String(datos.direccion ?? "").trim();

		if (!nombre) {
			validacion.pnombre = "Este campo es obligatorio.";
		} else if (!nombreAsciiRegex.test(nombre)) {
			validacion.pnombre = "No puedes usar números ni caracteres especiales.";
		}

		if (segundoNombre && !nombreAsciiRegex.test(segundoNombre)) {
			validacion.snombre = "No puedes usar números ni caracteres especiales.";
		}

		if (!apellidoPaterno) {
			validacion.apaterno = "Este campo es obligatorio.";
		} else if (!nombreAsciiRegex.test(apellidoPaterno)) {
			validacion.apaterno = "No puedes usar números ni caracteres especiales.";
		}

		if (!apellidoMaterno) {
			validacion.amaterno = "Este campo es obligatorio.";
		} else if (!nombreAsciiRegex.test(apellidoMaterno)) {
			validacion.amaterno = "No puedes usar números ni caracteres especiales.";
		}

		if (!correo) {
			validacion.correo = "El correo es obligatorio.";
		} else if (!validarFormatoCorreo(correo)) {
			validacion.correo = "El correo no es válido.";
		} else {
			const correoExistente = Usuario.porCorreo(correo);
			if (correoExistente && correoExistente.id !== usuario.id) {
				validacion.correo = "Este correo ya está registrado.";
			}
		}

		if (!telefono) {
			validacion.telefono = "Este campo es obligatorio.";
		} else if (!/^\+?[0-9\s\-]{8,15}$/.test(telefono)) {
			validacion.telefono = "El teléfono no es válido.";
		}

		if (!direccion) {
			validacion.direccion = "Este campo es obligatorio.";
		}

		return validacion;
	}

	function onSubmit(e) {
		e.preventDefault();
		if (!usuario)
			return navigate("/login");

		const erroresNuevos = validarFormulario(form);
		setErrores(erroresNuevos);
		if (Object.keys(erroresNuevos).length > 0)
			return;

		actualizarUsuario({
			pnombre: String(form.pnombre).trim(),
			snombre: String(form.snombre).trim(),
			apaterno: String(form.apaterno).trim(),
			amaterno: String(form.amaterno).trim(),
			correo: String(form.correo).trim(),
			direccion: String(form.direccion).trim(),
			telefono: String(form.telefono).trim(),
		});

		navigate("/cuenta");
	}

	const validacionesNombre = [
		[(v) => nombreAsciiRegex.test(v), "No puedes usar números ni caracteres especiales."]
	];
	const validacionesCorreo = [
		[(v) => validarFormatoCorreo(v), "El correo no es válido."]
	];
	const validacionesTelefono = [
		[(v) => /^\+?[0-9\s\-]{8,15}$/.test(v.trim()), "El teléfono no es válido."]
	];

	if (!usuario)
		return null;

	return (
		<div className="page-padding">
			<section className="header-titulo">
				<div>
					<h1>Actualizar cuenta</h1>
					<p style={{ color: "var(--cocoa-soft)" }}>Edita tu información personal.</p>
				</div>
			</section>

			<div className="account-card">
				<form onSubmit={onSubmit} className="account-form">
					<div className="form-group-row">
						<CuadroInput
							required
							nameId="pnombre"
							label="Nombre"
							placeholder="Primer nombre"
							value={form.pnombre}
							onChange={onChange}
							validaciones={validacionesNombre}
							error={errores.pnombre ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, pnombre: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, pnombre: "" }))}
						/>
						<CuadroInput
							nameId="snombre"
							label="Segundo nombre (opcional)"
							placeholder="Segundo nombre"
							value={form.snombre}
							onChange={onChange}
							validaciones={validacionesNombre}
							error={errores.snombre ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, snombre: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, snombre: "" }))}
						/>
					</div>

					<div className="form-group-row">
						<CuadroInput
							required
							nameId="apaterno"
							label="Apellido paterno"
							placeholder="Apellido paterno"
							value={form.apaterno}
							onChange={onChange}
							validaciones={validacionesNombre}
							error={errores.apaterno ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, apaterno: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, apaterno: "" }))}
						/>
						<CuadroInput
							required
							nameId="amaterno"
							label="Apellido materno"
							placeholder="Apellido materno"
							value={form.amaterno}
							onChange={onChange}
							validaciones={validacionesNombre}
							error={errores.amaterno ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, amaterno: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, amaterno: "" }))}
						/>
					</div>

					<div className="form-group-row">
						<CuadroInput
							required
							nameId="correo"
							label="Correo"
							placeholder="correo@gmail.com"
							value={form.correo}
							onChange={onChange}
							validaciones={validacionesCorreo}
							error={errores.correo ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, correo: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, correo: "" }))}
						/>
						<CuadroInput
							required
							nameId="telefono"
							label="Teléfono"
							placeholder="+56912345678"
							value={form.telefono}
							onChange={onChange}
							validaciones={validacionesTelefono}
							error={errores.telefono ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, telefono: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, telefono: "" }))}
						/>
					</div>

					<div className="form-group">
						<CuadroInput
							required
							nameId="direccion"
							label="Dirección"
							placeholder="Calle, número, comuna"
							value={form.direccion}
							onChange={onChange}
							error={errores.direccion ?? ""}
							setError={(msg) => setErrores((prev) => ({ ...prev, direccion: msg }))}
							onInput={() => setErrores((prev) => ({ ...prev, direccion: "" }))}
						/>
					</div>

					<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
						<Boton type="submit" style={{ width: "min(100%, 220px)" }}>Guardar cambios</Boton>
						<BotonClaro type="button" onClick={onDiscard} style={{ width: "min(100%, 220px)" }}>Descartar cambios</BotonClaro>
					</div>
				</form>
			</div>
		</div>
	);
}
