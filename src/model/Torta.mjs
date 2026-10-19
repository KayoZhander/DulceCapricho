import { useEffect } from "react";
import { listaDe } from "../utils/Validacion.mjs";
import { Route } from "react-router-dom";

class CategoriaTorta {
	static #categorias = {
		Frutales: "Frutales",
		Especiales: "Especiales",
		Individuales: "Individuales"
	};

	static get Frutales() { return this.#categorias.Frutales; }
	static get Especiales() { return this.#categorias.Especiales; }
	static get Individuales() { return this.#categorias.Individuales; }

	static get listaCategorias() { return Object.values(this.#categorias); }

	static esCategoria(categoria) {
		if (typeof categoria !== "string")
			throw new Error("'categoria' debe ser de tipo string");
		return this.#categorias[categoria] != null;
	}
}

export default class Torta {
	static Categoria = CategoriaTorta;

	static tortas = [
		{
			id: 1,
			nombre: "Torta Blueberry",
			categoria: "Frutales",
			precio: 15000,
			imagen: "torta-blueberry.png",
			descripcion: "Deliciosa torta con relleno de arándanos frescos y crema suave de la casa."
		},
		{
			id: 2,
			nombre: "Torta Bizcocho Café",
			categoria: "Especiales",
			precio: 18000,
			imagen: "bizcocho-cafe.webp",
			descripcion: "Esponjoso bizcocho de café artesanal con suave crema estilo tiramisú."
		},
		{
			id: 3,
			nombre: "Mini Pastel Capricho",
			categoria: "Individuales",
			precio: 8000,
			imagen: "minipastel.jpg",
			descripcion: "Ideal para regalar o disfrutar un capricho personal en cualquier momento."
		}
	];

	// el constructor es ideal para agregar nuevas tortas
	// para obtener una torta existente, se recomienda usar porId()
	#id;
	constructor({
		id = null,
		nombre,
		descripcion,
		precio,
		categoria,
		imagen = ""
	}) {
		if (typeof id === "string")
			id = Number(id);
		if (typeof precio === "string")
			precio = Number(precio);

		if (id && typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		else if (typeof nombre !== "string")
			throw new Error("'nombre' debe ser de tipo string");
		else if (typeof descripcion !== "string")
			throw new Error("'descripcion' debe ser de tipo string");
		else if (typeof precio !== "number")
			throw new Error("'precio' debe ser de tipo númerico");
		else if (typeof imagen !== "string")
			throw new Error("'imagen' debe ser de tipo string");
		else if (!CategoriaTorta.esCategoria(categoria))
			throw new Error(`la categoria no existe: ${categoria}`);

		this.#id = id ? id : Torta.generarId();
		this.nombre = nombre.trim();
		this.descripcion = descripcion.trim();
		this.precio = precio;
		this.categoria = categoria;
		this.imagen = imagen.trim();
	}

	get id() { return this.#id; }

	static generarId() {
		for (let i = 1; ; i++)
			if (i > Torta.tortas.length || Torta.tortas[i - 1]?.id != i)
				return i;
	}

	toJSON() {
		return {
			id: this.#id,
			nombre: this.nombre,
			descripcion: this.descripcion,
			precio: this.precio,
			categoria: this.categoria,
			imagen: this.imagen
		};
	}

	actualizarLista() {
		Torta.actualizarCatalogo();
	}

	// agrega la torta al catalogo, retorna TRUE si se agrego el item correctamente, en caso contrario, retorna FALSE
	agregar() {
		if (Torta.contieneId(this.#id)) {
			console.warn(`ya existe un item con el id: ${this.#id}`);
			return false;
		}
		Torta.tortas.push(this);
		this.actualizarLista();
		return true;
	}

	actualizar() {
		const indice = Torta.tortas.findIndex(x => x.id === this.#id);
		if (indice === -1)
			throw new Error(`intento de actualizar un item que no existe (id ${this.#id})`);
		Torta.tortas[indice] = this;
		this.actualizarLista();
	}

	eliminar() {
		const indice = Torta.tortas.findIndex(x => x.id === this.#id);
		if (indice === -1) {
			console.warn(`no existe el item con el id: ${this.#id}`);
			return false;
		}
		Torta.tortas.splice(indice, 1);
		this.actualizarLista();
		return true;
	}

	static cargarCatalogo() {
		const tortasJson = localStorage.getItem("tortas");
		if (!tortasJson) {
			this.actualizarCatalogo();
			return;
		}
		const tortasGuardadas = JSON.parse(tortasJson);
		if (!(tortasGuardadas instanceof Array)) {
			console.warn("tortas no retorno una lista");
			this.actualizarCatalogo();
			return;
		}
		const tortasObjetos = [];
		tortasGuardadas.forEach(t => tortasObjetos.push(new Torta(t)));
		Torta.tortas = tortasObjetos;
	}

	static actualizarCatalogo() {
		localStorage.setItem("tortas", JSON.stringify(Torta.tortas));
	}

	static actualizarPorId(id, datosActualizados) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		const indice = Torta.tortas.findIndex((torta) => torta.id === id);
		if (indice === -1)
			return null;
		const tortaActual = Torta.tortas[indice];
		const tortaActualizada = new Torta({
			...tortaActual.toJSON(),
			...datosActualizados,
			id,
			categoria: datosActualizados.categoria ?? tortaActual.categoria,
			imagen: datosActualizados.imagen ?? tortaActual.imagen,
		});
		Torta.tortas[indice] = tortaActualizada;
		this.actualizarCatalogo();
		return tortaActualizada;
	}

	static contieneId(id) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		return Torta.tortas.find(x => x.id === id) != null;
	}

	static porId(id) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		return Torta.tortas.find(x => x.id === id);
	}
}
