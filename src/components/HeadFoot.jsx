import { Link } from "react-router"

export function Header() {
	return (<>
		<header>
			<strong>Dulce Capricho</strong>
			<nav aria-label="Menu">
				<Link to="/">Inicio</Link>
				<Link to="/tortas">Tortas</Link>
			</nav>
		</header>
	</>);
}

export function Footer() {
	return (<>
		<footer>
			<h3>Texto footer</h3>
		</footer>
	</>);
}
