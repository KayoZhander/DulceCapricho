import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validarFormatoCorreo, encriptarPassword } from "../utils/Validacion.mjs";
import { UsuarioContext } from "../contexts/AuthContext";
import CuadroInput from "../components/CuadroInput";
import PasswordInput from "../components/PasswordInput";
import Boton from "../components/Botones";
import Tarjeta from "../components/Tarjeta";
import Usuario from "../model/Usuario.mjs";
import "../styles/login.css";

const nombreAsciiRegex = /^[A-Za-z]*$/;

export default function Registrar() {
	const navigate = useNavigate();
	const { usuario, ..._ } = useContext(UsuarioContext);

	useEffect(() => {
		if (usuario)
			navigate("/cuenta");
	}, [usuario, navigate]);

	const [errorNombre, setErrorNombre] = useState("");
	const [errorSegundoNombre, setErrorSegundoNombre] = useState("");
	const [errorApellidoPaterno, setErrorApellidoPaterno] = useState("");
	const [errorApellidoMaterno, setErrorApellidoMaterno] = useState("");
	const [errorCorreo, setErrorCorreo] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorTelefono, setErrorTelefono] = useState("");
	const [errorDireccion, setErrorDireccion] = useState("");

	async function onSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const datos = Object.fromEntries(formData.entries());

		const errores = {};
		const nombre = String(datos.pnombre ?? "").trim();
		const segundoNombre = String(datos.snombre ?? "").trim();
		const apellidoPaterno = String(datos.apaterno ?? "").trim();
		const apellidoMaterno = String(datos.amaterno ?? "").trim();

		if (!nombre) {
			errores.pnombre = "Este campo es obligatorio.";
		} else if (!nombreAsciiRegex.test(nombre)) {
			errores.pnombre = "No puedes usar números ni caracteres especiales.";
		}

		if (segundoNombre && !nombreAsciiRegex.test(segundoNombre)) {
			errores.snombre = "No puedes usar números ni caracteres especiales.";
		}

		if (!apellidoPaterno) {
			errores.apaterno = "Este campo es obligatorio.";
		} else if (!nombreAsciiRegex.test(apellidoPaterno)) {
			errores.apaterno = "No puedes usar números ni caracteres especiales.";
		}

		if (!apellidoMaterno) {
			errores.amaterno = "Este campo es obligatorio.";
		} else if (apellidoMaterno && !nombreAsciiRegex.test(apellidoMaterno)) {
			errores.amaterno = "No puedes usar números ni caracteres especiales.";
		}

		if (!String(datos.correo ?? "").trim()) {
			errores.correo = "El correo es obligatorio.";
		} else if (!validarFormatoCorreo(datos.correo)) {
			errores.correo = "El correo no es válido.";
		}

		if (!String(datos.password ?? "").trim()) {
			errores.password = "Este campo es obligatorio.";
		} else if (String(datos.password).length < 8) {
			errores.password = "Debe tener al menos 8 caracteres.";
		}

		if (!String(datos.telefono ?? "").trim()) {
			errores.telefono = "Este campo es obligatorio.";
		} else if (!/^\+?[0-9\s\-]{8,15}$/.test(datos.telefono.trim())) {
			errores.telefono = "El teléfono no es válido.";
		}

		if (!String(datos.direccion ?? "").trim()) {
			errores.direccion = "Este campo es obligatorio.";
		}

		if (Usuario.contieneCorreo(datos.correo)) {
			errores.correo = "Este correo ya está registrado.";
		}

		setErrorNombre(errores.pnombre ?? "");
		setErrorSegundoNombre(errores.snombre ?? "");
		setErrorApellidoPaterno(errores.apaterno ?? "");
		setErrorApellidoMaterno(errores.amaterno ?? "");
		setErrorCorreo(errores.correo ?? "");
		setErrorPassword(errores.password ?? "");
		setErrorTelefono(errores.telefono ?? "");
		setErrorDireccion(errores.direccion ?? "");

		if (Object.keys(errores).length > 0)
			return;

		const passwordHash = await encriptarPassword(datos.password);
		const fechaRegistro = new Date(Date.now()).toISOString();

		Usuario.registrar({
			rol: Usuario.Rol.Regular,
			pnombre: nombre,
			snombre: segundoNombre,
			apaterno: apellidoPaterno,
			amaterno: apellidoMaterno,
			correo: datos.correo,
			direccion: String(datos.direccion).trim(),
			telefono: String(datos.telefono).trim(),
			fechaRegistro,
			password: passwordHash,
		});

		navigate("/cuenta");
	}

	const validacionesCorreo = [
		[(v) => validarFormatoCorreo(v), "El correo no es válido."],
	];

	const validacionesPassword = [
		[(v) => v.length >= 8, "Debe tener al menos 8 caracteres."],
	];

	const validacionesTelefono = [
		[(v) => /^\+?[0-9\s\-]{8,15}$/.test(v.trim()), "El teléfono no es válido."],
	];

	const validationesNombre = [
		[(v) => nombreAsciiRegex.test(v), "No puedes usar números ni caracteres especiales."]
	]

	return (
		<section className="login-section registro-section" style={{ marginBottom: "3.6rem" }}>
			<h1>Crear cuenta</h1>
			<Tarjeta className="login-card registro-card">
				<form id="registro-form" onSubmit={onSubmit}>
					<div className="registro-grid">
						<div className="registro-col">
							<CuadroInput
								required
								nameId="pnombre"
								label="Nombre"
								placeholder="Primer nombre"
								validaciones={validationesNombre}
								error={errorNombre}
								setError={setErrorNombre}
								onInput={() => setErrorNombre("")}
							/>
							<CuadroInput
								nameId="snombre"
								label="Segundo nombre (opcional)"
								placeholder="Segundo nombre"
								validaciones={validationesNombre}
								error={errorSegundoNombre}
								setError={setErrorSegundoNombre}
								onInput={() => setErrorSegundoNombre("")}
							/>
							<CuadroInput
								required
								nameId="apaterno"
								label="Apellido paterno"
								placeholder="Apellido paterno"
								validaciones={validationesNombre}
								error={errorApellidoPaterno}
								setError={setErrorApellidoPaterno}
								onInput={() => setErrorApellidoPaterno("")}
							/>
							<CuadroInput
								required
								nameId="amaterno"
								label="Apellido materno"
								placeholder="Apellido materno"
								validaciones={validationesNombre}
								error={errorApellidoMaterno}
								setError={setErrorApellidoMaterno}
								onInput={() => setErrorApellidoMaterno("")}
							/>
							<CuadroInput
								required
								nameId="telefono"
								label="Teléfono"
								placeholder="+56912345678"
								validaciones={validacionesTelefono}
								error={errorTelefono}
								setError={setErrorTelefono}
								onInput={() => setErrorTelefono("")}
							/>
						</div>

						<div className="registro-col">
							<CuadroInput
								required
								nameId="correo"
								label="Correo"
								placeholder="correo@gmail.com"
								validaciones={validacionesCorreo}
								error={errorCorreo}
								setError={setErrorCorreo}
								onInput={() => setErrorCorreo("")}
							/>
							<CuadroInput
								required
								nameId="direccion"
								label="Dirección"
								placeholder="Calle, número, comuna"
								error={errorDireccion}
								setError={setErrorDireccion}
								onInput={() => setErrorDireccion("")}
							/>
							<PasswordInput
								required
								nameId="password"
								label="Contraseña"
								placeholder="Contraseña"
								validaciones={validacionesPassword}
								error={errorPassword}
								setError={setErrorPassword}
								onInput={() => setErrorPassword("")}
							/>
						</div>
					</div>

					<Boton type="submit" style={{ width: "min(100%, 20rem)", margin: "1rem auto 0", display: "block" }}>Registrarme</Boton>
				</form>
				<div className="login-links" style={{ marginTop: "1.25rem" }}>
					<Link to="/login">Ya tengo una cuenta</Link>
				</div>
			</Tarjeta>
		</section>
	);
}
