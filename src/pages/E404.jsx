import { useNavigate } from "react-router-dom";
import "../styles/error.css";

export default function E404() {
	let navigate = useNavigate();

	return (<>
		<section className="error-section">
			<div>
				<h2>Pagina no encontrada</h2>
				<div className="actions">
					<button className="error-btn" onClick={() => navigate(-1)}>Volver</button>
					<button className="error-btn home-btn" onClick={() => navigate("/")}>Pagina de Inicio</button>
				</div>
			</div>
		</section>
	</>);
}
