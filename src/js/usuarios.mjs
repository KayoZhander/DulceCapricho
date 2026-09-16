const hashPassword = async (password) => {
	const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const USUARIOS = [];

const normalizarRol = (rol) => {
	const valor = String(rol ?? "cliente").trim().toLowerCase();
	return valor === "admin" ? "admin" : "cliente";
};

const _generarId = () => {
	let idGenerado = 1;
	const ids = USUARIOS.map(u => u.getId());
	while (ids.includes(idGenerado)) {
		idGenerado++;
	}
	return idGenerado;
};

export class Usuario {
	#id;
	#rol;
	#pnombre;
	#snombre;
	#apaterno;
	#amaterno;
	#carro;
	#correo;
	#telefono;
	#direccion;
	#password;

	constructor(id, rol, pnombre, snombre, apaterno, amaterno, carro, correo, telefono, direccion, password = "") {
		this.#id = id ?? _generarId();
		this.#rol = normalizarRol(rol);
		this.#pnombre = pnombre.trim().toUpperCase();
		this.#snombre = snombre.trim().toUpperCase();
		this.#apaterno = apaterno.trim().toUpperCase();
		this.#amaterno = amaterno.trim().toUpperCase();
		this.#carro = carro;
		this.#correo = correo.trim().toLowerCase();
		this.#telefono = Number(telefono);
		this.#direccion = (direccion ?? "").trim();
		this.#password = password;
	}

	getId() { return this.#id; }
	getRol() { return this.#rol; }
	getPnombre() { return this.#pnombre; }
	getSnombre() { return this.#snombre; }
	getApaterno() { return this.#apaterno; }
	getAmaterno() { return this.#amaterno; }
	getCarro() { return this.#carro; }
	getCorreo() { return this.#correo; }
	getTelefono() { return this.#telefono; }
	getDireccion() { return this.#direccion; }
	getPassword() { return this.#password; }

	setPnombre(pnombre) { this.#pnombre = pnombre.trim().toUpperCase(); }
	setSnombre(snombre) { this.#snombre = snombre.trim().toUpperCase(); }
	setApaterno(apaterno) { this.#apaterno = apaterno.trim().toUpperCase(); }
	setAmaterno(amaterno) { this.#amaterno = amaterno.trim().toUpperCase(); }
	setCarro(carro) { this.#carro = carro; }
	setCorreo(correo) { this.#correo = correo.trim().toLowerCase(); }
	setTelefono(telefono) { this.#telefono = Number(telefono); }
	setDireccion(direccion) { this.#direccion = direccion.trim(); }
	async setPassword(password) {
		this.#password = await hashPassword(password);
		return this.#password;
	}

	async validarPassword(password) {
		const hashedPassword = await hashPassword(password);
		return this.#password === hashedPassword;
	}
	static async crear(json) {
		const usuario = new Usuario(
			null,
			json.rol ?? "cliente",
			json.pnombre,
			json.snombre,
			json.apaterno,
			json.amaterno,
			json.carro,
			json.correo,
			json.telefono,
			json.direccion
		);
		await usuario.setPassword(json.password);
		return usuario;
	}
	static async crearAdminSiNoExiste() {
		const correoAdmin = "admin@dulcecapricho.com";
		let admin = RegistroUsuarios.obtenerUsuarioPorCorreo(correoAdmin);
		if (!admin) {
			admin = await Usuario.crear({
				rol: "admin",
				pnombre: "Admin",
				snombre: "",
				apaterno: "Sistema",
				amaterno: "Dulce",
				carro: [],
				correo: correoAdmin,
				telefono: "0000000000",
				direccion: "Local Dulce Capricho",
				password: "admin123"
			});
			RegistroUsuarios.agregarUsuario(admin);
		}
		return admin;
	}
	static fromJSON(json) {
		const { id, rol, pnombre, snombre, apaterno, amaterno, carro, correo, telefono, direccion, password } = json ?? {};
		return new Usuario(id, rol ?? "cliente", pnombre ?? "", snombre ?? "", apaterno ?? "", amaterno ?? "", carro ?? [], correo ?? "", telefono ?? null, direccion ?? "", password);
	}
	toJSON() {
		return {
			id: this.#id,
			rol: this.#rol,
			pnombre: this.#pnombre,
			snombre: this.#snombre,
			apaterno: this.#apaterno,
			amaterno: this.#amaterno,
			carro: this.#carro,
			correo: this.#correo,
			telefono: this.#telefono,
			direccion: this.#direccion,
			password: this.#password
		};
	}
}

const localUsuarios = JSON.parse(localStorage.getItem("usuarios") ?? "[]");
localUsuarios.forEach(u => {
	USUARIOS.push(Usuario.fromJSON(u));
});

export class RegistroUsuarios {
	static get cantidad() {
		return USUARIOS.length;
	}
	static listaUsuarios() {
		return USUARIOS;
	}
	static agregarUsuario(user) {
		if (!(user instanceof Usuario)) {
			console.warn("agregarUsuario(): usuario debe ser de tipo 'Usuario'");
			return;
		}
		if (this.idExiste(user.getId())) {
			console.warn(`agregarUsuario(): ya existe el usuario con el id ${user.getId()}`);
			return;
		}
		USUARIOS.push(user);
		localStorage.setItem("usuarios", JSON.stringify(USUARIOS));
	}
	static obtenerUsuario(id) {
		if (typeof id !== "number") {
			console.warn("obtenerUsuario(): parametro 'id' tiene que ser de tipo numero");
			return null;
		}
		for (const u of USUARIOS) {
			if (u.getId() == id) {
				return u;
			}
		}
		console.warn(`obtenerUsuario(): no se encontro ningun usuario con el id ${id}`);
		return null;
	}
	static obtenerUsuarioPorCorreo(correo) {
		if (typeof correo !== "string") {
			console.warn("obtenerUsuarioPorCorreo(): parametro 'correo' tiene que ser de tipo string");
			return null;
		}
		correo = correo.trim().toLowerCase();
		for (const u of USUARIOS) {
			if (u.getCorreo() === correo) {
				return u;
			}
		}
		console.warn(`obtenerUsuarioPorCorreo(): no se encontro ningun usuario con el correo ${correo}`);
		return null;
	}
	static actualizarUsuario(user) {
		if (!(user instanceof Usuario)) {
			console.warn("actualizarUsuario(): usuario debe ser de tipo 'Usuario'");
			return;
		}
		for (let i = 0; i < USUARIOS.length; i++) {
			const u = USUARIOS[i];
			if (u.getId() == user.getId()) {
				USUARIOS[i] = user;
				localStorage.setItem("usuarios", JSON.stringify(USUARIOS));
				return;
			}
		}
		console.warn(`actualizarUsuario(): no se encontro ningun usuario con el id ${user.getId()}`);
	}
	static eliminarUsuario(user) {
		if (!(user instanceof Usuario || user instanceof Number)) {
			console.warn("eliminarUsuario(): parametro 'user' tiene que ser de tipo 'Usuario', objeto o numero");
			return;
		}
		const userId = user instanceof Usuario ? user.getId() : user;
		for (let i = 0; i < USUARIOS.length; i++) {
			const u = USUARIOS[i];
			if (u.getId() == userId) {
				USUARIOS.splice(i, 1);
				localStorage.setItem("usuarios", JSON.stringify(USUARIOS));
				return;
			}
		}
		console.warn(`eliminarUsuario(): no se encontro ningun usuario con el id ${userId}`);
	}
	static idExiste(id) {
		if (typeof id !== "number") {
			console.warn("idExiste(): parametro 'id' tiene que ser de tipo numero");
			return false;
		}
		for (const u of USUARIOS) {
			if (u.getId() == id) {
				return true;
			}
		}
		return false;
	}
	static correoExiste(correo) {
		if (typeof correo !== "string") {
			console.warn("correoExiste(): parametro 'correo' tiene que ser de tipo string");
			return false;
		}
		correo = correo.trim().toLowerCase();
		for (const u of USUARIOS) {
			if (u.getCorreo() === correo) {
				return true;
			}
		}
		return false;
	}
}
