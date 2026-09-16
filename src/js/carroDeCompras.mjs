import { Usuario, RegistroUsuarios } from "./usuarios.mjs";

const leerCarrito = () => {
	try {
		const raw = localStorage.getItem("carro");
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const guardarCarrito = (items) => {
	localStorage.setItem("carro", JSON.stringify(items));
	const sesion = localStorage.getItem("sesion");
	if (sesion) {
		const usuario = Usuario.fromJSON(JSON.parse(sesion));
		usuario.setCarro(items);
		RegistroUsuarios.actualizarUsuario(usuario);
	}
};

export class CarritoDulceCapricho {
	static get items() {
		return leerCarrito();
	}

	static getResumen() {
		const items = this.items;
		const cantidadTotal = items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
		const subtotal = items.reduce((sum, item) => sum + (Number(item.precio) || 0) * (Number(item.cantidad) || 0), 0);
		return { items, cantidadTotal, subtotal };
	}

	static agregar(producto, cantidad = 1) {
		const items = this.items;
		const cantidadFinal = Math.max(1, Number(cantidad) || 1);
		const id = Number(producto?.id ?? producto?.getId?.() ?? 0);
		const nombre = producto?.nombre ?? producto?.getNombre?.() ?? "Producto";
		const precio = Number(producto?.precio ?? producto?.getPrecio?.() ?? 0);
		const imagen = producto?.imagen ?? producto?.getImagen?.() ?? "";
		const detalle = producto?.detalle ?? "";

		const index = items.findIndex((item) => Number(item.id) === id);
		if (index >= 0) {
			items[index].cantidad = (Number(items[index].cantidad) || 0) + cantidadFinal;
			if (!items[index].imagen && imagen) items[index].imagen = imagen;
			if (!items[index].precio && precio > 0) items[index].precio = precio;
			if (!items[index].detalle && detalle) items[index].detalle = detalle;
		} else {
			items.push({
				id,
				nombre,
				precio,
				imagen,
				detalle,
				cantidad: cantidadFinal
			});
		}

		guardarCarrito(items);
		return items;
	}

	static obtenerPorId(id) {
		return this.items.find((item) => Number(item.id) === Number(id)) ?? null;
	}

	static actualizarCantidad(id, cantidad) {
		const items = this.items;
		const cantidadFinal = Math.max(0, Number(cantidad) || 0);
		const index = items.findIndex((item) => Number(item.id) === Number(id));
		if (index === -1) return this.items;
		if (cantidadFinal <= 0) {
			items.splice(index, 1);
		} else {
			items[index].cantidad = cantidadFinal;
		}
		guardarCarrito(items);
		return items;
	}

	static eliminar(id) {
		const items = this.items.filter((item) => Number(item.id) !== Number(id));
		guardarCarrito(items);
		return items;
	}

	static vaciar() {
		guardarCarrito([]);
		return [];
	}
}
