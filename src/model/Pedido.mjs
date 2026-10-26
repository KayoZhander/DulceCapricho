const CLAVE_PEDIDOS = "dulcecapricho_pedidos";

class EstadoPedido {
	static #estados = {
		pendiente: { etiqueta: "Pendiente", clase: "estado-pendiente" },
		confirmado: { etiqueta: "Confirmado", clase: "estado-confirmado" },
		"en preparación": { etiqueta: "En preparación", clase: "estado-en-preparacion" },
		enviado: { etiqueta: "Enviado", clase: "estado-enviado" },
		entregado: { etiqueta: "Entregado", clase: "estado-entregado" },
		cancelado: { etiqueta: "Cancelado", clase: "estado-cancelado" }
	};

	static get Pendiente() { return "pendiente"; }
	static get Confirmado() { return "confirmado"; }


	static get lista() { return Object.entries(this.#estados); }


	static info(estado) { return this.#estados[estado] ?? this.#estados.pendiente; }
}

class TipoEntrega {
	static get Retiro() { return "Retiro en Tienda"; }
	static get Despacho() { return "Despacho a Domicilio"; }
}

class MetodoPago {
	static get Webpay() { return "webpay"; }
	static get Transferencia() { return "transferencia"; }

	static etiqueta(metodo) {
		return metodo === this.Transferencia ? "Transferencia" : "Webpay";
	}
}

export default class Pedido {
	static Estado = EstadoPedido;
	static TipoEntrega = TipoEntrega;
	static MetodoPago = MetodoPago;

	static todos() {
		try {
			const pedidos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS) || "[]");
			return Array.isArray(pedidos) ? pedidos : [];
		} catch {
			console.warn("error al cargar pedidos, formato no valido");
			return [];
		}
	}


	static deUsuario(usuario) {
		const pedidos = this.todos();
		if (!usuario)
			return pedidos.filter(p => !p.usuarioId);

		const correo = usuario.correo?.toLowerCase();
		return pedidos.filter(p =>
			p.usuarioId === usuario.id ||
			(correo && p.correo?.toLowerCase() === correo)
		);
	}


	static crear({
		cliente,
		correo,
		telefono,
		tipoEntrega,
		direccion = "",
		fechaEntrega,
		horaEntrega,
		metodoPago,
		items,
		usuarioId = null
	}) {
		if (!Array.isArray(items) || !items.length)
			throw new Error("el pedido no tiene productos");

		const productos = items.map(item => ({
			id: item.id,
			nombre: item.nombre,
			cantidad: Number(item.quantity ?? 1) || 1,
			precio: Number(item.precio) || 0
		}));
		const total = productos.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

		const pedido = {
			id: Date.now(),
			usuarioId,
			cliente,
			correo,
			telefono,
			tipoEntrega,
			direccion: tipoEntrega === TipoEntrega.Despacho && direccion
				? direccion
				: "Sin dirección registrada",
			fechaEntrega,
			horaEntrega,
			metodoPago,
			estado: metodoPago === MetodoPago.Webpay ? EstadoPedido.Confirmado : EstadoPedido.Pendiente,
			total,
			productos,
			creadoEn: new Date().toISOString()
		};

		const pedidos = this.todos();
		pedidos.unshift(pedido);
		localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
		return pedido;
	}
}