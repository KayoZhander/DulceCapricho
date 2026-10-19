import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../contexts/AuthContext";
import { CarroContext } from "../contexts/CarroContext";
import Boton, { BotonOscuro } from "./Botones";

export function Header() {
	let navigate = useNavigate();
	const { usuario, ..._ } = useContext(UsuarioContext);
	const { carro, ...__ } = useContext(CarroContext);

	const estiloBotonLogin = {
		fontSize: "1rem",
		padding: "10px 28px"
	}
	const estiloBotonPerfil = {
		width: "2.6rem",
		height: "2.6rem",
		padding: "0.5rem"
	};

	return (<>
		<header style={{ background: "var(--cream-dark)" }}>
			<strong
				className="brand-name"
				onClick={() => navigate("/")}
				style={{ cursor: "pointer" }}
			>Dulce Capricho</strong>
			<nav aria-label="Menu">
				<Link to="/">Inicio</Link>
				<Link to="/tortas">Tortas</Link>
				<Link to="/contacto">Contacto</Link>
				{
					carro.items.length ?
						<Link to="/carro">Carro ({carro.items.length})</Link> :
						<Link to="/carro">Carro</Link>
				}
				<Link to="/pedidos">Pedidos</Link>
				{
					usuario ?
						<BotonOscuro
							style={estiloBotonPerfil}
							onClick={() => navigate("/cuenta")}
						>{`${usuario.pnombre[0]?.toUpperCase?.()}${usuario.apaterno[0]?.toUpperCase?.() ?? ""}`}</BotonOscuro> :
						<Boton
							style={estiloBotonLogin}
							onClick={() => navigate("/login")}
						>Iniciar sesión</Boton>
				}
			</nav>
		</header>
	</>);
}

export function Footer() {
	return (<>
		<footer>
			<span className="ribbon">
				Hecho a mano, con cariño.
			</span>
		</footer>
	</>);
}
