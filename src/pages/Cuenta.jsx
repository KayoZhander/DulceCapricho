import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../contexts/AuthContext";
import Boton from "../components/Botones";
import PopupConfirmar from "../components/PopupConfirmar";
import "../styles/cuenta.css";
import Usuario from "../model/Usuario.mjs";

export default function Cuenta() {
	const navigate = useNavigate();
	const { usuario, logout, borrarCuenta } = useContext(UsuarioContext);

	useEffect(() => {
		if (!usuario)
			navigate("/login");
	}, [usuario, navigate]);

	if (!usuario)
		return null;

	const nombreFormateado = usuario ? (usuario.pnombre[0]?.toUpperCase?.() ?? "") + usuario.pnombre.slice(1).toLowerCase() + " " +
		(usuario.apaterno[0]?.toUpperCase?.() ?? "") + usuario.apaterno.slice(1).toLowerCase() : "";
	const fechaRegistro = usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleString("es-ES", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}) : "Sin datos";

	const datosCuenta = [
		{ label: "Nombre", value: `${usuario.pnombre ?? ""} ${usuario.snombre ?? ""}`.trim() || "No registrado" },
		{ label: "Apellido", value: `${usuario.apaterno ?? ""} ${usuario.amaterno ?? ""}`.trim() || "No registrado" },
		{ label: "Correo", value: usuario.correo || "No registrado" },
		{ label: "Teléfono", value: usuario.telefono || "No registrado" },
		{ label: "Dirección", value: usuario.direccion || "No registrada" },
		{ label: "Fecha de registro", value: fechaRegistro },
	];

	const [confirmarLogout, setConfirmarLogout] = useState(false);
	const [confirmarEliminar1, setConfirmarEliminar1] = useState(false);
	const [confirmarEliminar2, setConfirmarEliminar2] = useState(false);

	return (
		<div className="page-padding">
			<section className="header-titulo">
				<div>
					<h1>Hola, {nombreFormateado.trim() || "Usuario"}.</h1>
					<p style={{ color: "var(--cocoa-soft)" }}>Aquí puedes ver y administrar tu información personal.</p>
				</div>
			</section>

			<div className="account-grid">
				<aside className="account-sidebar">
					<div className="account-card">
						<h2>Opciones</h2>
						<Boton type="button" onClick={() => setConfirmarLogout(true)} style={{ width: "100%", marginBottom: "0.75rem" }}>
							Cerrar sesión
						</Boton>
						<button
							disabled={usuario.rol === Usuario.Rol.Admin}
							type="button"
							className="btn danger-btn"
							style={{ width: "100%" }}
							onClick={() => setConfirmarEliminar1(true)}
						>
							Eliminar cuenta
						</button>
					</div>
				</aside>

				<section className="account-card account-details">
					<h2>Detalles de la cuenta</h2>
					<div className="account-detail-list">
						{datosCuenta.map(({ label, value }) => (
							<div key={label} className="account-detail-row">
								<span className="account-detail-label">{label}</span>
								<strong className="account-detail-value">{value}</strong>
							</div>
						))}
					</div>
					<Boton
						type="button"
						disabled={usuario.rol === Usuario.Rol.Admin}
						onClick={() => navigate("/cuenta/editar")}
						style={{ width: "min(100%, 240px)", marginTop: "1rem" }}
					>Actualizar datos</Boton>
				</section>
			</div>

			<PopupConfirmar
				open={confirmarLogout}
				title="Cerrar sesión"
				mensaje="¿Deseas cerrar sesión?"
				confirmText="Cerrar sesión"
				cancelText="Cancelar"
				onConfirm={() => {
					logout();
					navigate("/login");
					setConfirmarLogout(false);
				}}
				onCancel={() => setConfirmarLogout(false)}
				onClose={() => setConfirmarLogout(false)}
			/>
			<PopupConfirmar
				open={confirmarEliminar1}
				title="Eliminar cuenta"
				mensaje="¿Deseas eliminar tu cuenta?"
				confirmText="Eliminar"
				cancelText="Cancelar"
				onConfirm={() => {
					setConfirmarEliminar2(true);
				}}
				onCancel={() => setConfirmarEliminar1(false)}
				onClose={() => setConfirmarEliminar1(false)}
			/>
			<PopupConfirmar
				peligroso
				open={confirmarEliminar2}
				title="¿Seguro?"
				mensaje="Una vez que borres la cuenta, no la puedes recuperar. ¿De verdad quieres hacer esto?"
				confirmText="Sí, elimina la cuenta"
				cancelText="Mejor no"
				onConfirm={() => {
					borrarCuenta();
					navigate("/login");
					setConfirmarEliminar2(false);
				}}
				onCancel={() => setConfirmarEliminar2(false)}
				onClose={() => setConfirmarEliminar2(false)}
			/>
		</div>
	);
}
