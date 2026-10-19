import { useNavigate } from "react-router-dom";
import Boton, { BotonOscuro } from "../components/Botones";
import "../styles/error.css";

export default function E404() {
	let navigate = useNavigate();

	return (<>
		<section className="error-section">
			<div>
				<h2>Pagina no encontrada</h2>
				<div className="actions">
					<Boton
						style={{ width: "100%", marginTop: "1.5rem" }}
						onClick={() => navigate(-1)}
					>Volver</Boton>
					<BotonOscuro
						style={{ width: "100%", marginTop: "1.5rem" }}
						onClick={() => navigate("/")}
					>Pagina de Inicio</BotonOscuro>
				</div>
			</div>
		</section >
	</>);
}
