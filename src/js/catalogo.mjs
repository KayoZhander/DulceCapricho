// agrega todas las tortas que quieras :-O

const TORTAS = [];

const _generarId = () => {
	let idGenerado = 1;
	const ids = TORTAS.map(t => t.getId());
	while (ids.includes(idGenerado)) {
		idGenerado++;
	}
	return idGenerado;
}

export class Torta {
	// atributos privados (en JS, los declaras privado con '#')
	#id;
	#nombre;
	#detalle;
	#precio;
	#imagen;
	#tonoA;
	#tonoB;

	constructor(nombre, detalle, precio, imagen, tonoA, tonoB, id) {
		this.#id = id ?? _generarId();
		this.#nombre = nombre;
		this.#detalle = detalle;
		this.#precio = Number(precio) ?? 0;
		this.#imagen = imagen;
		this.#tonoA = tonoA;
		this.#tonoB = tonoB;
	}

	getId() { return this.#id; }
	getNombre() { return this.#nombre; }
	getDetalle() { return this.#detalle; }
	getPrecio() { return this.#precio; }
	getImagen() { return this.#imagen; }
	getTonoA() { return this.#tonoA; }
	getTonoB() { return this.#tonoB; }

	setNombre(nombre) { this.#nombre = nombre.trim(); }
	setDetalle(detalle) { this.#detalle = detalle.trim(); }
	setPrecio(precio) { this.#precio = precio; }
	setImagen(imagen) { this.#imagen = imagen; }
	setTonoA(tonoA) { this.#tonoA = tonoA; }
	setTonoB(tonoB) { this.#tonoB = tonoB; }

	static fromJSON(json) {
		const { id, nombre, detalle, precio, imagen, tonoA, tonoB } = json ?? {};
		return new Torta(nombre ?? "", detalle ?? "", precio ?? 0, imagen ?? null, tonoA ?? "", tonoB ?? "", id);
	}
	toJSON() {
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
}

const localTortas = JSON.parse(localStorage.getItem("tortas") ?? "[]");
localTortas.forEach(t => {
	TORTAS.push(Torta.fromJSON(t));
});

export class CatalogoTortas {
	static get cantidad() {
		return TORTAS.length;
	}
	static listaTortas() {
		return TORTAS;
	}
	static agregarTorta(torta) {
		if (!(torta instanceof Torta)) {
			console.warn("agregarTorta(): parametro 'torta' tiene que ser de tipo 'Torta' o objeto");
			return;
		}
		if (this.idExiste(torta.getId())) {
			console.warn(`agregarTorta(): ya existe la torta con el id ${torta.getId()}`);
			return;
		}
		TORTAS.push(torta);
		localStorage.setItem("tortas", JSON.stringify(TORTAS));
	}
	static obtenerTorta(id) {
		if (typeof id !== "number") {
			console.warn("obtenerTorta(): parametro 'id' tiene que ser de tipo numero");
			return null;
		}
		for (const t of TORTAS) {
			if (t.getId() == id) {
				return t;
			}
		}
		console.warn(`obtenerTorta(): no se encontro ninguna torta con el id ${id}`);
		return null;
	}
	static actualizarTorta(torta) {
		if (!(torta instanceof Torta)) {
			console.warn("actualizarTorta(): parametro 'torta' tiene que ser de tipo 'Torta' o objeto");
			return;
		}
		for (let i = 0; i < TORTAS.length; i++) {
			const t = TORTAS[i];
			if (t.getId() == torta.getId()) {
				TORTAS[i] = torta;
				localStorage.setItem("tortas", JSON.stringify(TORTAS));
				return;
			}
		}
		console.warn(`actualizarTorta(): no se encontro ninguna torta con el id ${torta.getId()}`);
	}
	static eliminarTorta(torta) {
		if (!(torta instanceof Torta || typeof torta === "number")) {
			console.warn("eliminarTorta(): parametro 'torta' tiene que ser de tipo 'Torta', objeto o numero");
			return;
		}
		const objetivo = torta instanceof Torta ? torta.getId() : torta;
		for (let i = 0; i < TORTAS.length; i++) {
			const t = TORTAS[i];
			if (t.getId() == objetivo) {
				TORTAS.splice(i, 1);
				localStorage.setItem("tortas", JSON.stringify(TORTAS));
				return;
			}
		}
		console.warn(`eliminarTorta(): no se encontro ninguna torta con el id ${objetivo}`);
	}
	static idExiste(id) {
		if (typeof id !== "number") {
			console.warn("idExiste(): parametro 'id' tiene que ser de tipo numero");
			return false;
		}
		for (const t of TORTAS) {
			if (t.getId() == id) {
				return true;
			}
		}
		return false;
	}
}

// initializar datos
if (CatalogoTortas.cantidad == 0) {
	CatalogoTortas.agregarTorta(new Torta(
		"Torta de Chocolate",
		"Bizcocho húmedo con ganache oscuro y un toque de café.",
		18000,
		"/images/bizcocho-cafe.webp",
		"#5C3A2E",
		"#8C5A44",
	));
	CatalogoTortas.agregarTorta(new Torta(
		"Torta de Frutilla",
		"Crema suave con frutillas frescas y bizcocho de vainilla.",
		22000,
		"images/torta-frutilla.jpg",
		"#B34A4A",
		"#D97A7A",
	));
	CatalogoTortas.agregarTorta(new Torta(
		"Torta de Limón",
		"Merengue italiano y relleno de crema de limón con base crujiente.",
		20000,
		"images/torta-limon.jpg",
		"#C2B13B",
		"#E8D44D",
	));
	CatalogoTortas.agregarTorta(new Torta(
		"Torta de Blueberry",
		"Bizcocho esponjoso con relleno de crema y arándanos frescos.",
		25000,
		"images/torta-blueberry.png",
		"#1e3f97",
		"#6f41d8"
	));
}
