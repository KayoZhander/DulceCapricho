import { useContext } from "react";
import { CarroContext } from "../contexts/CarroContext";
import Boton from "./Botones";

export default function CarroItem({ tortaId }) {
	const {
		carro,
		agregarItem,
		quitarItem,
		incrementarItem,
		disminuirItem,
	} = useContext(CarroContext);

	const item = carro.items.find((producto) => producto.id === tortaId);
	if (!item) return null;

	const subtotal = item.precio * item.quantity;

	return (
		<article className="carrito-item">
			<div className="carrito-item-imagen">
				<img src={item.imagen || "https://placehold.co/300x300?text=Dulce+Capricho"} alt={item.nombre} />
			</div>

			<div className="carrito-item-info">
				<div className="carrito-item-header">
					<h3>{item.nombre}</h3>
					<Boton
						style={{
							padding: "6px 12px",
							fontSize: "0.85rem"
						}}
						onClick={() => quitarItem(item.id)}
					>Eliminar</Boton>
				</div>

				<p>{item.descripcion}</p>

				<div className="carrito-item-meta">
					<span className="estado-badge estado-en-preparacion" style={{ padding: "6px 14px" }}>{item.categoria}</span>
					<strong>${item.precio.toLocaleString("es-CL")}</strong>
				</div>

				<div className="carrito-item-actions">
					<div className="cantidad-control" aria-label={`Cantidad de ${item.nombre}`}>
						<button type="button" onClick={() => disminuirItem(item.id)} aria-label="Disminuir cantidad">
							−
						</button>
						<span>{item.quantity}</span>
						<button type="button" onClick={() => incrementarItem(item.id)} aria-label="Aumentar cantidad">
							+
						</button>
					</div>

					<span className="carrito-subtotal">
						${subtotal.toLocaleString("es-CL")}
					</span>
				</div>
			</div>
		</article>
	);
}
