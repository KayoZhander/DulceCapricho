import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Boton from "../components/Botones";
import PasswordInput from "../components/PasswordInput";
import Tarjeta from "../components/Tarjeta";
import { UsuarioContext } from "../contexts/AuthContext";
import Usuario from "../model/Usuario.mjs";
import PopupDialogo from "../components/PopupDialogo.jsx";
import { encriptarPassword } from "../utils/Validacion.mjs";
import "../styles/login.css";

export default function RecuperarPassword() {
	let navigate = useNavigate();

	const { usuario } = useContext(UsuarioContext);
	const [correo, setCorreo] = useState(() => sessionStorage.getItem("correoRecuperacion") ?? "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

	const [cambioAplicado, setCambioAplicado] = useState(false);

	useEffect(() => {
		if (usuario)
			navigate("/cuenta");
	}, [usuario, navigate]);

	useEffect(() => {
		if (!correo)
			navigate("/recuperar");
	}, [correo, navigate]);

	async function onSubmit(e) {
		e.preventDefault();
		if (!correo)
			return navigate("/recuperar");

		const nuevaPassword = String(password ?? "").trim();
		const confirmarPassword = String(confirmPassword ?? "").trim();
		const errores = {};

		if (!nuevaPassword) {
			errores.password = "Este campo es obligatorio.";
		} else if (nuevaPassword.length < 8) {
			errores.password = "Debe tener al menos 8 caracteres.";
		}

		if (!confirmarPassword) {
			errores.confirmPassword = "Este campo es obligatorio.";
		} else if (confirmarPassword !== nuevaPassword) {
			errores.confirmPassword = "Las contraseñas no coinciden.";
		}

		setErrorPassword(errores.password ?? "");
		setErrorConfirmPassword(errores.confirmPassword ?? "");
		if (Object.keys(errores).length > 0)
			return;

		const usuarioGuardado = Usuario.porCorreo(correo);
		if (!usuarioGuardado) {
			navigate("/recuperar");
			return;
		}

		const passwordHash = await encriptarPassword(nuevaPassword);
		Usuario.actualizarPorId(usuarioGuardado.id, { password: passwordHash });
		sessionStorage.removeItem("correoRecuperacion");
		sessionStorage.removeItem("codigoRecuperacion");
		setCambioAplicado(true);
	}

	return (<>
		<section className="login-section">
			<h1>Restablecer contraseña</h1>
			<Tarjeta className="login-card">
				<h4 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.9rem", textAlign: "justify", lineHeight: "1.4rem" }}>
					Escribe la nueva contraseña para la cuenta <strong>{correo}</strong>.
				</h4>
				<form id="recuperar-password-form" onSubmit={onSubmit}>
					<PasswordInput
						required
						nameId="password"
						label="Nueva contraseña"
						placeholder="Nueva contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onInput={(e) => setPassword(e.target.value)}
						error={errorPassword}
						setError={setErrorPassword}
					/>
					<PasswordInput
						required
						nameId="confirmPassword"
						label="Confirmar contraseña"
						placeholder="Confirmar contraseña"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						onInput={(e) => setConfirmPassword(e.target.value)}
						error={errorConfirmPassword}
						setError={setErrorConfirmPassword}
					/>
					<Boton type="submit" style={{ width: "100%", marginTop: "0.8rem" }}>
						Guardar contraseña
					</Boton>
				</form>
			</Tarjeta>
		</section>
		<PopupDialogo
			open={cambioAplicado}
			title="Contraseña cambiada"
			onClose={(e) => e.preventDefault()}
		>
			<p className="dialog-message">Se ha cambiado la contraseña correctamente.</p>
			<div className="dialog-actions">
				<button
					type="button"
					className="btn dialog-button dialog-button-danger"
					onClick={() => {
						navigate("/login");
						setCambioAplicado(false);
					}}
				>Iniciar sesión</button>
			</div>
		</PopupDialogo>
	</>);
}
