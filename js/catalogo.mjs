// agrega todas las tortas que quieras :-O

export class Torta {
	// atributos privados (en JS, los declaras privado con '#')
	#id;
	#nombre;
	#detalle;
	#precio;
	#imagen;
	#tonoA;
	#tonoB;

	constructor(id, nombre, detalle, precio, imagen, tonoA, tonoB) {
		this.#id = id ?? this.generarId();
		this.#nombre = nombre;
		this.#detalle = detalle;
		this.#precio = precio;
		this.#imagen = imagen;
		this.#tonoA = tonoA;
		this.#tonoB = tonoB;
	}

	get getId() { return this.#id; }
	get getNombre() { return this.#nombre; }
	get getDetalle() { return this.#detalle; }
	get getPrecio() { return this.#precio; }
	get getImagen() { return this.#imagen; }
	get getTonoA() { return this.#tonoA; }
	get getTonoB() { return this.#tonoB; }

	set setNombre(nombre) { this.#nombre = nombre.trim(); }
	set setDetalle(detalle) { this.#detalle = detalle.trim(); }
	set setPrecio(precio) { this.#precio = precio; }
	set setImagen(imagen) { this.#imagen = imagen; }
	set setTonoA(tonoA) { this.#tonoA = tonoA; }
	set setTonoB(tonoB) { this.#tonoB = tonoB; }

	static desdeJson(json) {
		return new Torta(
			json.id,
			json.nombre,
			json.detalle,
			json.precio,
			json.imagen,
			json.tonoA,
			json.tonoB
		);
	}
	convertirAJson() {
		return {
			id: this.#id,
			nombre: this.#nombre,
			detalle: this.#detalle,
			precio: this.#precio,
			imagen: this.#imagen,
			tonoA: this.#tonoA,
			tonoB: this.#tonoB
		};
	}
	static generarId() {
		let idGenerado = 1;
		for (let i = 0; i < TORTAS.length; i++) {
			if (TORTAS[i].getId() != idGenerado) {
				return idGenerado;
			}
			idGenerado++;
		}
		return idGenerado;
	}
}

export class CatalogoTortas {
	static listaTortas() {
		return TORTAS;
	}
	static agregarTorta(torta) {
		if (torta instanceof Object) {
			torta = Torta.desdeJson(torta);
		}
		if (torta instanceof Torta) {
			if (!this.idExiste(torta.getId())) {
				TORTAS.push(torta);
			} else {
				console.warn(`agregarTorta(): ya existe la torta con el id ${torta.getId()}`);
			}
		} else {
			console.warn("agregarTorta(): parametro 'torta' tiene que ser de tipo 'Torta' o objeto");
		}
	}
	static actualizarTorta(torta) {
		if (torta instanceof Object) {
			torta = Torta.desdeJson(torta);
		}
		if (torta instanceof Torta) {
			for (let i = 0; i < TORTAS.length; i++) {
				const t = array[i];
				if (t.getId() == torta.getId()) {
					TORTAS[i] = torta;
					return;
				}
			}
			console.warn(`actualizarTorta(): no se encontro ninguna torta con el id ${torta.getId()}`);
		} else {
			console.warn("actualizarTorta(): parametro 'torta' tiene que ser de tipo 'Torta' o objeto");
		}
	}
	static eliminarTorta(torta) {
		if (torta instanceof Torta || torta instanceof Object || torta instanceof Number) {
			// usando .? en caso si el argumento 'torta' es un numero
			const objetivo = torta?.getId() ?? torta;
			for (let i = 0; i < TORTAS.length; i++) {
				const t = TORTAS[i];
				if (t.getId() == objetivo) {
					TORTAS.splice(i, 1);
					return;
				}
				console.warn(`eliminarTorta(): no se encontro ninguna torta con el id ${objetivo}`);
			}
		} else {
			console.warn("eliminarTorta(): parametro 'torta' tiene que ser de tipo 'Torta', objeto o numero");
		}
	}
	static idExiste(id) {
		if (!(id instanceof Number)) {
			console.warn("idExiste(): parametro 'id' tiene que ser de tipo numero");
			return false;
		}
		for (const t in TORTAS) {
			if (t.getId() == id) {
				return true;
			}
		}
		return false;
	}
}

const TORTAS = [
	Torta.desdeJson({
		nombre: "Torta de Chocolate",
		detalle: "Bizcocho húmedo con ganache oscuro y un toque de café.",
		precio: 18000,
		imagen: null,
		tonoA: "#5C3A2E",
		tonoB: "#8C5A44",
	}),
	Torta.desdeJson({
		nombre: "Torta de Frutilla",
		detalle: "Crema suave con frutillas frescas y bizcocho de vainilla.",
		precio: 22000,
		imagen: null,
		tonoA: "#B34A4A",
		tonoB: "#D97A7A",
	}),
	Torta.desdeJson({
		nombre: "Torta de Limón",
		detalle: "Merengue italiano y relleno de crema de limón con base crujiente.",
		precio: 20000,
		imagen: null,
		tonoA: "#C2B13B",
		tonoB: "#E8D44D",
	}),
	Torta.desdeJson({
		nombre: "Torta de Blueberry",
		detalle: "sjdfkjasl",
		precio: 99999,
		imagen: null,
		tonoA: "#1e3f97",
		tonoB: "#6f41d8"
	})
];
