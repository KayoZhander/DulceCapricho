import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarroContext } from "../contexts/CarroContext";
import { UsuarioContext } from "../contexts/AuthContext";
import Pedido from "../model/Pedido.mjs";
import Titulo from "../components/Titulo";
import Boton from "../components/Botones";
import "../styles/tortas.css";
import "../styles/checkout.css";

const HORARIOS = [
	"10:00 - 12:00",
	"12:00 - 14:00",
	"15:00 - 18:00",
	"19:00 - 20:00"
];


function fechaHoy() {
	const hoy = new Date();
	const mes = String(hoy.getMonth() + 1).padStart(2, "0");
	const dia = String(hoy.getDate()).padStart(2, "0");
	return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function datosIniciales(usuario) {
	return {
		nombre: usuario
			? [usuario.pnombre, usuario.snombre, usuario.apaterno, usuario.amaterno].filter(Boolean).join(" ")
			: "",
		correo: usuario?.correo ?? "",
		telefono: usuario?.telefono ?? "",
		tipoEntrega: "retiro",
		direccion: usuario?.direccion ?? "",
		fechaEntrega: "",
		horaEntrega: "",
		metodoPago: Pedido.MetodoPago.Webpay
	};
}

export default function Checkout() {
	const navigate = useNavigate();
	const { carro, limpiarCarrito } = useContext(CarroContext);
	const { usuario } = useContext(UsuarioContext);

	const [datos, setDatos] = useState(() => datosIniciales(usuario));
	const [errorPago, setErrorPago] = useState(null);

	const esDespacho = datos.tipoEntrega === "despacho";
	const esTransferencia = datos.metodoPago === Pedido.MetodoPago.Transferencia;

	function cambiar(e) {
		const { name, value } = e.target;
		setDatos(previos => ({ ...previos, [name]: value }));
	}

	function confirmarPedido(e) {
		e.preventDefault();
		if (!carro.items.length) return;

		try {
			const pedido = Pedido.crear({
				cliente: datos.nombre.trim(),
				correo: datos.correo.trim(),
				telefono: datos.telefono.trim(),
				tipoEntrega: esDespacho ? Pedido.TipoEntrega.Despacho : Pedido.TipoEntrega.Retiro,
				direccion: datos.direccion.trim(),
				fechaEntrega: datos.fechaEntrega,
				horaEntrega: datos.horaEntrega,
				metodoPago: datos.metodoPago,
				items: carro.items,
				usuarioId: usuario?.id ?? null
			});

			limpiarCarrito();
			navigate("/pedidos", { state: { pedidoConfirmado: pedido } });
		} catch (error) {
			console.error("no se pudo crear el pedido", error);
			setErrorPago("No pudimos registrar tu pedido. Inténtalo nuevamente.");
		}
	}

	return (<>
		<div className="page-padding container">
			<Titulo titulo="Finalizar compra" subtitulo="Completa tus datos para confirmar el pedido." />

			{!carro.items.length ? (
				<div className="empty-state">
					<p className="vacio-mensaje">No tienes productos en el carro para procesar la compra.</p>
					<Boton onClick={() => navigate("/tortas")}>Ver tortas</Boton>
				</div>
			) : (
				<div className="checkout-grid">
					<form className="alt-bg checkout-form" onSubmit={confirmarPedido}>
						<h3>1. Datos personales</h3>
						<div className="form-group">
							<label htmlFor="nombre">Nombre completo *</label>
							<input
								type="text" id="nombre" name="nombre" required
								placeholder="Ej. María González"
								value={datos.nombre} onChange={cambiar}
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label htmlFor="correo">Correo electrónico *</label>
								<input
									type="email" id="correo" name="correo" required
									placeholder="correo@ejemplo.com"
									value={datos.correo} onChange={cambiar}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="telefono">Teléfono *</label>
								<input
									type="tel" id="telefono" name="telefono" required
									placeholder="+56 9 1234 5678"
									value={datos.telefono} onChange={cambiar}
								/>
							</div>
						</div>

						<h3>2. Tipo de entrega</h3>
						<div className="form-group">
							<label htmlFor="tipoEntrega">Modalidad *</label>
							<select
								id="tipoEntrega" name="tipoEntrega" required
								value={datos.tipoEntrega} onChange={cambiar}
							>
								<option value="retiro">Retiro en tienda</option>
								<option value="despacho">Despacho a domicilio</option>
							</select>
						</div>

						{esDespacho && (
							<div className="form-group">
								<label htmlFor="direccion">Dirección de envío *</label>
								<input
									type="text" id="direccion" name="direccion" required
									placeholder="Calle, número, comuna"
									value={datos.direccion} onChange={cambiar}
								/>
							</div>
						)}

						<div className="form-row">
							<div className="form-group">
								<label htmlFor="fechaEntrega">Fecha *</label>
								<input
									type="date" id="fechaEntrega" name="fechaEntrega" required
									min={fechaHoy()}
									value={datos.fechaEntrega} onChange={cambiar}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="horaEntrega">Rango horario *</label>
								<select
									id="horaEntrega" name="horaEntrega" required
									value={datos.horaEntrega} onChange={cambiar}
								>
									<option value="">Seleccione un horario</option>
									{HORARIOS.map(hora => (
										<option key={hora} value={hora}>{hora} hrs</option>
									))}
								</select>
							</div>
						</div>

						<h3>3. Método de pago</h3>
						<div className="metodos-pago">
							<label className="metodo-card">
								<input
									type="radio" name="metodoPago"
									value={Pedido.MetodoPago.Webpay}
									checked={!esTransferencia} onChange={cambiar}
								/>
								<span>Webpay / Tarjeta (débito-crédito)</span>
							</label>
							<label className="metodo-card">
								<input
									type="radio" name="metodoPago"
									value={Pedido.MetodoPago.Transferencia}
									checked={esTransferencia} onChange={cambiar}
								/>
								<span>Transferencia electrónica</span>
							</label>
						</div>

						{esTransferencia && (
							<div className="info-pago" style={{ marginBottom: "1.5rem" }}>
								<p>
									<strong>Datos banco:</strong> Banco Estado | Cuenta Corriente | Nº 12345678 | RUT: 76.543.210-K | pago@dulcecapricho.cl
								</p>
							</div>
						)}

						{errorPago && (
							<p role="alert" style={{ color: "var(--danger)", marginBottom: "1rem" }}>{errorPago}</p>
						)}

						<Boton type="submit" style={{ width: "100%", padding: "1rem" }}>
							Simular pago y confirmar pedido
						</Boton>
					</form>

					<aside className="alt-bg checkout-resumen">
						<h3>Resumen de la compra</h3>
						<ul className="resumen-lista">
							{carro.items.map(item => (
								<li key={item.id}>
									<span>{item.nombre} (x{item.quantity})</span>
									<strong>${(item.precio * item.quantity).toLocaleString("es-CL")}</strong>
								</li>
							))}
						</ul>
						<hr />
						<div className="resumen-total">
							<span>Total a pagar:</span>
							<strong>${carro.total.toLocaleString("es-CL")}</strong>
						</div>
					</aside>
				</div>
			)}
		</div>
	</>);
}
