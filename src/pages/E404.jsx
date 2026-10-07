import { Link } from "react-router-dom";

export default function E404() {
	return (<>
		<h2>Pagina no encontrada</h2>
		<Link to="/">Volver al Inicio</Link>
	</>);
}
