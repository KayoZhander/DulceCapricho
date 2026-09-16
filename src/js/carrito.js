import { CarritoDulceCapricho } from "./carroDeCompras.mjs";

const tablaBody = document.querySelector("#carrito-tabla-body");
const vacioMensaje = document.querySelector("#carrito-vacio-msg");
const resumenCant = document.querySelector("#resumen-cant-items");
const resumenSubtotal = document.querySelector("#resumen-subtotal");
const resumenTotal = document.querySelector("#resumen-total");
const btnVaciarCarrito = document.querySelector("#btn-vaciar-carrito");

const formatearPrecio = (valor) => `$${Number(valor || 0).toLocaleString("es-CL")}`;

const renderCarrito = () => {
	const items = CarritoDulceCapricho.items;
	const totalItems = items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
	const subtotal = items.reduce((sum, item) => sum + ((Number(item.precio) || 0) * (Number(item.cantidad) || 0)), 0);

	if (!tablaBody || !vacioMensaje) return;

	if (items.length === 0) {
		tablaBody.innerHTML = "";
		vacioMensaje.style.display = "block";
		resumenCant.textContent = "0";
		resumenSubtotal.textContent = formatearPrecio(0);
		resumenTotal.textContent = formatearPrecio(0);
		return;
	}

	vacioMensaje.style.display = "none";
	tablaBody.innerHTML = items.map((item) => {
		const cantidad = Number(item.cantidad) || 1;
		const subtotalItem = (Number(item.precio) || 0) * cantidad;
		return `
			<tr data-id="${item.id}">
				<td>
					<div class="producto-nombre">
						<strong>${item.nombre}</strong>
						${item.detalle ? `<br><small>${item.detalle}</small>` : ''}
					</div>
				</td>
				<td>${formatearPrecio(item.precio)}</td>
				<td>
					<div class="cantidad-controles">
						<button type="button" data-action="decrement" data-id="${item.id}">-</button>
						<span>${cantidad}</span>
						<button type="button" data-action="increment" data-id="${item.id}">+</button>
					</div>
				</td>
				<td>${formatearPrecio(subtotalItem)}</td>
				<td><button type="button" class="btn-eliminar" data-action="remove" data-id="${item.id}">Eliminar</button></td>
			</tr>
		`;
	}).join("");

	resumenCant.textContent = String(totalItems);
	resumenSubtotal.textContent = formatearPrecio(subtotal);
	resumenTotal.textContent = formatearPrecio(subtotal);
};

if (tablaBody) {
	tablaBody.addEventListener("click", (event) => {
		const btn = event.target.closest("button[data-action]");
		if (!btn) return;

		const id = Number(btn.dataset.id);
		const action = btn.dataset.action;
		const itemActual = CarritoDulceCapricho.obtenerPorId(id);
		if (!itemActual) return;

		if (action === "increment") {
			CarritoDulceCapricho.agregar({ id: itemActual.id, nombre: itemActual.nombre, precio: itemActual.precio }, 1);
		}
		if (action === "decrement") {
			CarritoDulceCapricho.actualizarCantidad(id, (Number(itemActual.cantidad) || 1) - 1);
		}
		if (action === "remove") {
			CarritoDulceCapricho.eliminar(id);
		}
		renderCarrito();
	});
}

btnVaciarCarrito?.addEventListener("click", () => {
	if (CarritoDulceCapricho.items.length === 0) {
		alert("El carrito ya está vacío.");
		return;
	}
	if (!confirm("¿Estás seguro de que deseas vaciar el carrito?\nEsta acción no se puede deshacer.")) {
		return;
	}
	CarritoDulceCapricho.vaciar();
	renderCarrito();
});

renderCarrito();
