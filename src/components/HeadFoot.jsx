import { Link } from "react-router-dom";

export function Header() {
	return (<>
		<header>
			<strong className="brand-name">Dulce Capricho</strong>
			<nav aria-label="Menu">
				<Link to="/">Inicio</Link>
				<Link to="/tortas">Tortas</Link>
				<Link to="/login">Iniciar sesión</Link>
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
