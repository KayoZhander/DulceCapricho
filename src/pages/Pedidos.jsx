import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../contexts/AuthContext";
import Pedido from "../model/Pedido.mjs";
import Titulo from "../components/Titulo";
import Boton from "../components/Botones";
import PedidoItem from "../components/PedidoItem";
import { formatearFecha } from "../utils/formato.mjs";
import PopupDialogo from "../components/PopupDialogo";
import "../styles/tortas.css";

const TODOS = "todos";

export default function Pedidos() {
	const navigate = useNavigate();
	const location = useLocation();
	const { usuario } = useContext(UsuarioContext);

	const [filtro, setFiltro] = useState(TODOS);
	const [confirmado, setConfirmado] = useState(() => location.state?.pedidoConfirmado ?? null);


	useEffect(() => {
		if (location.state?.pedidoConfirmado)
			navigate(location.pathname, { replace: true, state: null });
	}, [location.state, location.pathname, navigate]);

	const pedidos = useMemo(() => (
		Pedido.deUsuario(usuario)
			.sort((a, b) => new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0))
	), [usuario]);

	const filtrados = filtro === TODOS
		? pedidos
		: pedidos.filter(p => (p.estado || Pedido.Estado.Pendiente) === filtro);

	return (<>
		<div className="page-padding">
			<Titulo
				titulo="Tus pedidos"
				subtitulo={usuario
					? "Historial de tus compras en Dulce Capricho."
					: "Pedidos hechos en este navegador. Inicia sesión para ver los asociados a tu cuenta."}
			/>

			<section className="pedidos-toolbar">
				<div className="toolbar-group">
					<label htmlFor="filtro-estado">Filtrar por estado</label>
					<select id="filtro-estado" value={filtro} onChange={e => setFiltro(e.target.value)}>
						<option value={TODOS}>Todos</option>
						{Pedido.Estado.lista.map(([valor, { etiqueta }]) => (
							<option key={valor} value={valor}>{etiqueta}</option>
						))}
					</select>
				</div>
			</section>

			<section className="pedidos-lista" aria-live="polite">
				{filtrados.length ? (
					filtrados.map(pedido => <PedidoItem key={pedido.id} pedido={pedido} />)
				) : (
					<div className="empty-state">
						{pedidos.length ? (
							<p>No tienes pedidos con ese estado.</p>
						) : (<>
							<p style={{ marginBottom: "1rem" }}>Aún no tienes pedidos.</p>
							<Boton onClick={() => navigate("/tortas")}>Ver tortas</Boton>
						</>)}
					</div>
				)}
			</section>
		</div>

		<PopupDialogo
			open={confirmado !== null}
			onClose={() => setConfirmado(null)}
			title="¡Pedido confirmado!"
		>
			{confirmado && (
				<p className="dialog-message">
					Gracias por tu compra, {confirmado.cliente}.<br />
					Pedido #{confirmado.id} · {confirmado.tipoEntrega}<br />
					Fecha programada: {formatearFecha(confirmado.fechaEntrega)} ({confirmado.horaEntrega})<br /><br />
					{confirmado.metodoPago === Pedido.MetodoPago.Transferencia
						? "Por favor, realiza la transferencia con los datos proporcionados para validar tu pedido."
						: "Pago aprobado exitosamente mediante Webpay."}
				</p>
			)}
			<div className="dialog-actions">
				<button type="button" className="btn dialog-button" onClick={() => setConfirmado(null)}>
					Entendido
				</button>
			</div>
		</PopupDialogo>
	</>);
}
