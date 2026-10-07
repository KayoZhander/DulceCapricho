import { useContext, useState } from "react";
import { UsuarioContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import "../styles/login.css";

/*

puede preguntar sobre las pruebas unitarias
si vamos a mostrar una prueba, hay que estar preparado para ejecutarlo

*/

export default function Login() {
	const login = useContext(UsuarioContext);
	const [correo, setCorreo] = useState("");
	const [password, setPassword] = useState("");

	function botonLogin(e) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const datosLogin = Object.fromEntries(formData.entries());
		console.log(datosLogin);
	}

	function mostrarPassword(e) {
		e.preventDefault();
		// no tocar >:(
		const inputPassword = [...e.target.parentElement.children].filter((x) => x.id === "password")[0];

		if (inputPassword.type === "password") {
			e.target.textContent = "Ocultar contraseña";
			inputPassword.type = "text";
		} else {
			e.target.textContent = "Mostrar contraseña";
			inputPassword.type = "password";
		}
	}

	const espacioRegex = /[^\w\p{P}\p{S}]+/gu;

	function eliminarEspaciosPassword(e) {
		if (!espacioRegex.test(e.target.value)) {
			setPassword(e.target.value);
			return;
		}
		const posInicio = e.target.selectionStart - 1;
		const posFin = e.target.selectionEnd - 1;
		console.log(posInicio, posFin);
		e.target.value = e.target.value.replace(espacioRegex, "");
		e.target.selectionStart = posInicio;
		e.target.selectionEnd = posFin;
	}

	return (<>
		<section className="login-section">
			<div className="login-card">
				<form id="login-form" onSubmit={botonLogin}>
					<div className="form-group">
						<label for="email">Correo</label>
						<input id="email" name="email" type="email" placeholder="correo@gmail.com" onInput={(e) => setCorreo(e.target.value)}></input>
					</div>
					<div className="form-group">
						<label for="password">Contraseña</label>
						<input id="password" name="password" type="password" placeholder="Contraseña" onInput={(e) => eliminarEspaciosPassword(e)}></input>
						<Link to="#" onClick={mostrarPassword}>Mostrar contraseña</Link>
					</div>
					<button type="submit" className="login-btn">Iniciar sesión</button>
				</form>
				<div className="login-links">
					<Link to="/registrar">Crear cuenta</Link>
					<Link to="/recuperar">¿Olvidaste la contraseña?</Link>
				</div>
			</div>
		</section>
	</>);
}
