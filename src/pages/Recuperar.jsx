import { Link, useNavigate } from "react-router-dom";
import Boton from "../components/Botones";
import CuadroInput from "../components/CuadroInput";
import Tarjeta from "../components/Tarjeta";
import "../styles/login.css";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../contexts/AuthContext";
import Usuario from "../model/Usuario.mjs";
import { validarFormatoCorreo } from "../utils/Validacion.mjs";

export default function Recuperar() {
	const navigate = useNavigate();

	const { usuario, ..._ } = useContext(UsuarioContext);
	const [correo, setCorreo] = useState("");
	const [codigoIngresado, setCodigoIngresado] = useState("");
	const [codigoRecuperacion, setCodigoRecuperacion] = useState(
		() => sessionStorage.getItem("codigoRecuperacion") ?? ""
	);
	const [errorCorreo, setErrorCorreo] = useState(null);
	const [errorCodigo, setErrorCodigo] = useState(null);

	useEffect(() => {
		if (usuario)
			navigate("/cuenta");
	}, [usuario, navigate]);

	useEffect(() => {
		if (codigoRecuperacion)
			sessionStorage.setItem("codigoRecuperacion", codigoRecuperacion);
		else
			sessionStorage.removeItem("codigoRecuperacion");
	}, [codigoRecuperacion]);

	function generarCodigo() {
		const codigo = String(Math.floor(100000 + (Math.random() * 900000)));
		setCodigoRecuperacion(codigo);
		return codigo;
	}

	function validarCorreoExiste(correoIngresado) {
		if (!correoIngresado) {
			setErrorCorreo("Este campo es obligatorio.");
			return false;
		}
		if (!Usuario.contieneCorreo(correoIngresado) || Usuario.correoEsAdmin(correoIngresado)) {
			setErrorCorreo("Este correo no esta registrado.");
			return false;
		}
		return true;
	}

	function handleGenerarCodigo() {
		const correoNormalizado = String(correo ?? "").trim();
		setErrorCorreo("");
		setErrorCodigo("");

		if (!validarCorreoExiste(correoNormalizado))
			return;

		const codigo = generarCodigo();
		sessionStorage.setItem("correoRecuperacion", correoNormalizado.toUpperCase());
		setCodigoIngresado("");
		setErrorCodigo(`Código simulado generado: ${codigo}. Ingresa este código para continuar.`);
	}

	function botonRecuperar(e) {
		e.preventDefault();
		const correoNormalizado = String(correo ?? "").trim();
		const codigo = String(codigoIngresado ?? "").trim();

		setErrorCorreo("");
		setErrorCodigo("");

		if (!validarCorreoExiste(correoNormalizado))
			return;

		const codigoEsperado = codigoRecuperacion || sessionStorage.getItem("codigoRecuperacion");
		if (!codigoEsperado) {
			const nuevoCodigo = generarCodigo();
			sessionStorage.setItem("correoRecuperacion", correoNormalizado.toUpperCase());
			setErrorCodigo(`Se generó un código nuevo: ${nuevoCodigo}. Ingresa ese código para continuar.`);
			return;
		}
		if (!/^\d{6}$/.test(codigo)) {
			setErrorCodigo("Debes ingresar un código de 6 dígitos.");
			return;
		}
		if (codigo !== codigoEsperado) {
			setErrorCodigo("El código es incorrecto.");
			return;
		}

		sessionStorage.setItem("correoRecuperacion", correoNormalizado.toUpperCase());
		navigate("/recuperar/passwd");
	}

	const validacionesCorreo = [
		[(v) => validarFormatoCorreo(v), "El correo no es valido."]
	];

	return (<>
		<section className="login-section">
			<h1>Recuperar cuenta</h1>
			<Tarjeta className="login-card">
				<h4 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.9rem", textAlign: "justify", lineHeight: "1.4rem" }}>
					Para recuperar tu cuenta, necesitamos el correo asociado a la cuenta
					para validar el código de un solo uso y luego cambiar la contraseña.
				</h4>
				<form id="login-form" onSubmit={botonRecuperar}>
					<CuadroInput
						required
						nameId="email"
						label="Correo"
						placeholder="correo@gmail.com"
						value={correo}
						onChange={(e) => setCorreo(e.target.value)}
						onInput={(e) => setCorreo(e.target.value)}
						validaciones={validacionesCorreo}
						error={errorCorreo}
						setError={setErrorCorreo}
					/>
					<Boton type="button" onClick={handleGenerarCodigo} style={{ width: "100%", marginBottom: "0.8rem" }}>
						Generar código
					</Boton>
					<CuadroInput
						required
						nameId="codigo-recuperacion"
						label="Código de 6 dígitos"
						placeholder="123456"
						value={codigoIngresado}
						onChange={(e) => setCodigoIngresado(e.target.value)}
						onInput={(e) => setCodigoIngresado(e.target.value)}
						validaciones={[[v => /^\d{6}$/.test(v), "Debes ingresar un código de 6 dígitos."]]}
						error={errorCodigo}
						setError={setErrorCodigo}
					/>
					{codigoRecuperacion && (
						<p style={{ margin: "0.3rem 0 0.8rem", color: "var(--cocoa-soft)", fontSize: ".92rem" }}>
							Código simulado: <strong>{codigoRecuperacion}</strong>
						</p>
					)}
					<Boton type="submit" style={{ width: "100%", marginTop: "0.2rem" }}>Continuar</Boton>
				</form>
				<div className="login-links">
					<Link to="/login">Volver al inicio sesión</Link>
				</div>
			</Tarjeta>
		</section>
	</>);
}
