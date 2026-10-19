import { encriptarPassword } from "../utils/Validacion.mjs";

const _ADMIN_CORREO = "ADMIN@DULCECAPRICHO.COM";
const _ADMIN_PASSWORD = "7fcf4ba391c48784edde599889d6e3f1e47a27db36ecc050cc92f259bfac38afad2c68a1ae804d77075e8fb722503f3eca2b2c1006ee6f6c7b7628cb45fffd1d";

class RolUsuario {
	static #roles = {
		Admin: "Admin",
		Regular: "Regular"
	};

	static get Admin() { return this.#roles.Admin; }
	static get Regular() { return this.#roles.Regular; }

	static esRol(rol) {
		if (typeof rol !== "string")
			throw new Error("'rol' debe ser de tipo string");
		return this.#roles[rol] != null;
	}
}

export default class Usuario {
	static Rol = RolUsuario;

	static usuarios = [
		{
			id: 1,
			rol: this.Rol.Admin,
			pnombre: "ADMIN",
			snombre: "",
			apaterno: "",
			amaterno: "",
			correo: _ADMIN_CORREO,
			direccion: "",
			telefono: "",
			fechaRegistro: new Date(Date.UTC(2024, 0, 1)).toISOString(),
			password: _ADMIN_PASSWORD // admin123
		}
	];

	#id; #password;
	constructor({
		id = null,
		rol = Rol.Regular,
		pnombre,
		snombre = "",
		apaterno = "",
		amaterno = "",
		correo,
		direccion = "",
		telefono = "",
		fechaRegistro = new Date(Date.now()).toISOString(),
		password
	}) {
		if (typeof id === "string")
			id = Number(id);

		if (id && typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		else if (typeof pnombre !== "string")
			throw new Error("'pnombre' debe ser de tipo string");
		else if (typeof snombre !== "string")
			throw new Error("'snombre' debe ser de tipo string");
		else if (typeof apaterno !== "string")
			throw new Error("'apaterno' debe ser de tipo string");
		else if (typeof amaterno !== "string")
			throw new Error("'amaterno' debe ser de tipo string");
		else if (typeof correo !== "string")
			throw new Error("'correo' debe ser de tipo string");
		else if (typeof direccion !== "string")
			throw new Error("'direccion' debe ser de tipo string");
		else if (typeof telefono !== "string")
			throw new Error("'telefono' debe ser de tipo string");
		else if (typeof fechaRegistro !== "string")
			throw new Error("'fechaRegistro' debe ser de tipo string");
		else if (typeof password !== "string")
			throw new Error("'password' debe ser de tipo string");

		this.#id = id != null ? id : Usuario.generarId();
		this.rol = rol;
		this.pnombre = pnombre.trim().toUpperCase();
		this.snombre = snombre.trim().toUpperCase();
		this.apaterno = apaterno.trim().toUpperCase();
		this.amaterno = amaterno.trim().toUpperCase();
		this.correo = correo.trim().toUpperCase();
		this.direccion = direccion.trim();
		this.telefono = telefono.trim();
		this.fechaRegistro = fechaRegistro;
		this.#password = password;
	}

	static generarId() {
		for (let i = 1; ; i++)
			if (i > Usuario.usuarios.length || Usuario.usuarios[i - 1]?.id != i)
				return i;
	}

	get id() { return this.#id; }

	async compararPassword(texto) {
		if (typeof texto !== "string")
			throw new Error("'texto' debe ser de tipo string");
		return await encriptarPassword(texto) === this.#password;
	}

	toJSON() {
		return {
			id: this.#id,
			rol: this.rol,
			pnombre: this.pnombre,
			snombre: this.snombre,
			apaterno: this.apaterno,
			amaterno: this.amaterno,
			correo: this.correo,
			direccion: this.direccion,
			telefono: this.telefono,
			fechaRegistro: this.fechaRegistro,
			password: this.#password,
		};
	}

	static idEsAdmin(id) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		return Usuario.usuarios.find(x => x.id === id && x.rol === Usuario.Rol.Admin) != null;
	}

	static contieneId(id) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		return Usuario.usuarios.find(x => x.id === id) != null;
	}

	static porId(id) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		return Usuario.usuarios.find(x => x.id === id);
	}

	static correoEsAdmin(correo) {
		if (typeof correo !== "string")
			throw new Error("'correo' debe ser de tipo string");
		correo = correo.toUpperCase();
		return Usuario.usuarios.find(x => x.correo.toUpperCase() === correo && x.rol === Usuario.Rol.Admin) != null;
	}

	static contieneCorreo(correo) {
		if (typeof correo !== "string")
			throw new Error("'correo' debe ser de tipo string");
		correo = correo.toUpperCase();
		return Usuario.usuarios.find(x => x.correo.toUpperCase() === correo) != null;
	}

	static porCorreo(correo) {
		if (typeof correo !== "string")
			throw new Error("'correo' debe ser de tipo string");
		correo = correo.toUpperCase();
		return Usuario.usuarios.find(x => x.correo.toUpperCase() === correo);
	}

	static registrar(datosUsuario) {
		const usuario = new Usuario(datosUsuario);
		Usuario.usuarios.push(usuario);
		Usuario.actualizarUsuarios();
		return usuario;
	}

	static actualizarPorId(id, datosActualizados) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		const indice = Usuario.usuarios.findIndex((usuario) => usuario.id === id);
		if (indice === -1)
			return null;
		const usuarioActual = Usuario.usuarios[indice];
		const cambios = {
			...usuarioActual.toJSON(),
			...datosActualizados,
			id,
		};
		const usuarioActualizado = new Usuario(cambios);
		Usuario.usuarios[indice] = usuarioActualizado;
		Usuario.actualizarUsuarios();
		return usuarioActualizado;
	}

	static eliminarPorId(id) {
		if (typeof id !== "number")
			throw new Error("'id' debe ser de tipo númerico");
		const usuariosRestantes = Usuario.usuarios.filter((usuario) => usuario.id !== id);
		if (usuariosRestantes.length === Usuario.usuarios.length)
			return false;
		Usuario.usuarios = usuariosRestantes;
		Usuario.actualizarUsuarios();
		return true;
	}

	static cargarUsuarios() {
		const usuariosJson = localStorage.getItem("usuarios");
		if (!usuariosJson) {
			Usuario.actualizarUsuarios();
			return;
		}
		const usuariosGuardadas = JSON.parse(usuariosJson);
		if (!(usuariosGuardadas instanceof Array)) {
			console.warn("usuarios no retorno una lista");
			Usuario.actualizarUsuarios();
			return;
		}
		const usuariosObjetos = usuariosGuardadas.map((usuario) => new Usuario(usuario));
		Usuario.usuarios = usuariosObjetos;
	}

	static actualizarUsuarios() {
		localStorage.setItem("usuarios", JSON.stringify(Usuario.usuarios));
	}
}
