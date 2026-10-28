import { useEffect } from "react";
import Torta from "./Torta.mjs";

export default class CarroDeCompras {
	static #items = [];

	static get items() { return this.#items; }

	static cargarItems() {
		const carroJson = localStorage.getItem("carrito");
		if (!carroJson) {
			this.actualizarItems();
			return;
		}
		const carroGuardado = JSON.parse(carroJson);
		if (!carroGuardado instanceof Array) {
			console.warn("carro no retorno una lista");
			this.actualizarItems();
			return;
		}
		const carroItems = [];
		carroGuardado.forEach(t => carroItems.push(new Torta(t)));
		this.#items = carroItems;
	}

	static actualizarItems() {
		localStorage.setItem("carrito", JSON.stringify(this.#items));
	}

	static agregarItem(id, cantidad = 1) {
		if (typeof cantidad !== "number")
			throw new Error("'cantidad' debe ser de tipo númerico");
		const torta = Torta.porId(id);
		if (!torta)
			throw new Error(`no hay ningun item con el id: ${id}`);
		else if (!torta instanceof Torta)
			throw new Error("item no es de tipo 'Torta'");
		for (let i = 0; i < cantidad; i++)
			this.#items.push(torta);
		console.log(this.#items);

		this.actualizarItems();
	}

	static eliminarItem(id, cantidad = 1) {
		if (typeof cantidad !== "number")
			throw new Error("'cantidad' debe ser de tipo númerico");
		for (let i = 0; i < cantidad; i++) {
			const indice = this.#items.findIndex(x => x.id === id);
			if (indice === -1)
				break;
			this.#items.splice(indice, 1);
		}
		this.actualizarItems();
	}

	static vaciarCarro() {
		this.#items = [];
		this.actualizarItems();
	}
}
