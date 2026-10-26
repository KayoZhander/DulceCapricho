import Pedido from "../model/Pedido.mjs";
import { formatearFecha, formatearPrecio } from "../utils/formato.mjs";

export default function PedidoItem({ pedido }) {
	const estado = Pedido.Estado.info(pedido.estado);
	const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

	return (
		<article className="pedido-card">
			<div className="pedido-top">
				<h2>Pedido #{pedido.id}</h2>
				<span className={`estado-badge ${estado.clase}`}>{estado.etiqueta}</span>
			</div>

			<div className="pedido-grid">
				<div className="meta-block">
					<span className="meta-label">Cliente</span>
					<span className="meta-value">{pedido.cliente || "Cliente sin nombre"}</span>
				</div>
				<div className="meta-block">
					<span className="meta-label">Entrega</span>
					<span className="meta-value">{pedido.tipoEntrega || "Sin información"}</span>
				</div>
				<div className="meta-block">
					<span className="meta-label">Fecha</span>
					<span className="meta-value">{formatearFecha(pedido.fechaEntrega)}</span>
				</div>
				<div className="meta-block">
					<span className="meta-label">Horario</span>
					<span className="meta-value">{pedido.horaEntrega || "Sin horario"}</span>
				</div>
			</div>

			<ul className="pedido-items">
				{productos.length ? productos.map((item, i) => (
					<li key={`${item.id ?? item.nombre}-${i}`}>
						<span className="item-name">{item.nombre} x{item.cantidad || 1}</span>
						<span className="item-total">
							{formatearPrecio((Number(item.precio) || 0) * (Number(item.cantidad) || 1))}
						</span>
					</li>
				)) : (
					<li><span className="item-name">Sin productos registrados</span></li>
				)}
			</ul>

			<div className="pedido-footer">
				<div className="pedido-total">
					<strong>Total:</strong> {formatearPrecio(pedido.total)}
				</div>
				<div className="meta-value">{Pedido.MetodoPago.etiqueta(pedido.metodoPago)}</div>
			</div>
		</article>
	);
}
