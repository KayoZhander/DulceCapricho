import { useContext } from "react";
import Contenedor from "../components/Contenedor";
import Titulo from "../components/Titulo";
import CarroItem from "../components/CarroItem";
import { CarroContext } from "../contexts/CarroContext";
import Boton, { BotonClaro } from "../components/Botones";
import "../styles/tortas.css";
import "../styles/carrito.css";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
	let navigate = useNavigate();

	const { carro, vaciarCarrito } = useContext(CarroContext);
	const totalProductos = carro.items.reduce((sum, item) => sum + item.quantity, 0);

	return (<>
		<div className="page-padding container">
			<Titulo titulo="Carro de compras" subtitulo="Revisa tus tortas seleccionadas antes de pagar." />
			<div className="carrito-layout">
				<Contenedor plomo>
					{!carro.items.length ? (
						<div className="carrito-items-panel" style={{ alignContent: "center", alignItems: "center", gap: 0 }}>
							<p className="vacio-mensaje">Tu carrito está vacío por ahora.</p>
							<Boton style={{ width: "35%", height: "2.7rem", padding: "8px" }} onClick={() => navigate("/tortas")}>Ver tortas</Boton>
						</div>
					) : (
						<div className="carrito-items-panel">
							<div className="carrito-item-list">
								{carro.items.map((item) => (
									<CarroItem key={item.id} tortaId={item.id} />
								))}
							</div>
						</div>
					)}
				</Contenedor>

				<aside className="card carrito-resumen">
					<h2>Resumen</h2>
					<div className="resumen-linea">
						<span>Productos</span>
						<strong>{totalProductos}</strong>
					</div>
					<div className="resumen-linea">
						<span>Subtotal</span>
						<strong>${carro.total.toLocaleString("es-CL")}</strong>
					</div>
					<div className="resumen-linea total">
						<span style={{ fontWeight: 700 }}>Total</span>
						<strong>${carro.total.toLocaleString("es-CL")}</strong>
					</div>

					<div className="resumen-acciones">
						<Boton
							disabled={carro.items.length === 0}
							type="button"
							onClick={() => { }}
						>Ir a pagar</Boton>
						<BotonClaro
							disabled={carro.items.length === 0}
							type="button"
							onClick={vaciarCarrito}
						>Vaciar carrito</BotonClaro>
					</div>
				</aside>
			</div>
		</div>
	</>);
}
