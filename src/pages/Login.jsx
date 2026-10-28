import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { validarFormatoCorreo } from "../utils/Validacion.mjs";
import CuadroInput from "../components/CuadroInput";
import PasswordInput from "../components/PasswordInput";
import Usuario from "../model/Usuario.mjs";
import Boton from "../components/Botones";
import Tarjeta from "../components/Tarjeta";
import "../styles/login.css";

/*
puede preguntar sobre las pruebas unitarias
si vamos a mostrar una prueba, hay que estar preparado para ejecutarlo
*/

export default function Login() {
	let navigate = useNavigate();

	const { usuario, login, logout, borrarCuenta } = useContext(UsuarioContext);
	const [correo, setCorreo] = useState("");
	const [password, setPassword] = useState("");

	const [errorCorreo, setErrorCorreo] = useState(null);
	const [errorPassword, setErrorPassword] = useState(null);

	useEffect(() => {
		if (usuario)
			navigate("/cuenta");
	}, [usuario, navigate]);

	async function botonLogin(e) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const datosLogin = Object.fromEntries(formData.entries());

		const correoVacio = !datosLogin.email.trim();
		const passwordVacio = !datosLogin.password;
		const passwordMuyCorto = datosLogin.password.length < 8;

		if (correoVacio || passwordVacio || passwordMuyCorto) {
			if (correoVacio)
				setErrorCorreo("Este campo es obligatorio.");
			if (passwordVacio)
				setErrorPassword("Este campo es obligatorio.");
			else if (passwordMuyCorto)
				setErrorPassword("Debe tener al menos 8 caracteres.");
			return;
		}

		if (!Usuario.contieneCorreo(datosLogin.email)) {
			setErrorCorreo("Correo incorrecto.");
		} else {
			setErrorCorreo("");
			if (!await login(datosLogin)) {
				setErrorPassword("Contraseña incorrecta.");
				return;
			}
			setErrorPassword("");
			navigate("/cuenta");
		}
	}

	function onMostrarPassword(e) {
		e.preventDefault();
	}

	const validacionesCorreo = [
		[(v) => {
			return validarFormatoCorreo(v);
		}, "El correo no es valido."]
	];

	const validacionesPassword = [
		[(v) => {
			return v.length >= 8;
		}, "Debe tener al menos 8 caracteres."]
	];

	return (<>
		<section className="login-section">
			<h1>Bienvenido</h1>
			<Tarjeta className="login-card">
				<form id="login-form" onSubmit={botonLogin}>
					<CuadroInput
						required
						nameId="email"
						label="Correo"
						placeholder="correo@gmail.com"
						onInput={(e) => setCorreo(e.target.value)}
						validaciones={validacionesCorreo}

						error={errorCorreo}
						setError={setErrorCorreo}
					/>
					<PasswordInput
						required
						nameId="password"
						label="Contraseña"
						placeholder="Contraseña"
						validaciones={validacionesPassword}
						error={errorPassword}
						setError={setErrorPassword}
					/>
					<Boton type="submit" style={{ width: "100%", marginTop: "0.8rem" }}>Iniciar sesión</Boton>
				</form>
				<div className="login-links">
					<Link to="/registrar">Crear cuenta</Link>
					<Link to="/recuperar">¿Olvidaste la contraseña?</Link>
				</div>
			</Tarjeta>
		</section>
	</>);
}
