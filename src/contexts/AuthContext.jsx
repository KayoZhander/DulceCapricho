import { createContext, useEffect, useState } from "react";
import Usuario from "../model/Usuario.mjs";

export const UsuarioContext = createContext({
	usuario: null,
	login: async () => false,
	logout: () => { },
	borrarCuenta: () => { },
	actualizarUsuario: () => null,
});

export function UsuarioProvider({ children }) {
	Usuario.cargarUsuarios();

	const [usuario, setUsuario] = useState(() => {
		const usuarioGuardado = localStorage.getItem("sesion");
		if (!usuarioGuardado) return null;

		try {
			const sesion = JSON.parse(usuarioGuardado);
			if (sesion && typeof sesion === "object" && "id" in sesion)
				return sesion;
			return Usuario.porCorreo(sesion) ? Usuario.porCorreo(sesion).toJSON() : null;
		} catch {
			return Usuario.porCorreo(usuarioGuardado) ? Usuario.porCorreo(usuarioGuardado).toJSON() : null;
		}
	});

	useEffect(() => {
		if (usuario)
			localStorage.setItem("sesion", JSON.stringify(usuario));
		else
			localStorage.removeItem("sesion");
	}, [usuario]);

	async function login({ email, password }) {
		if (!email || !password)
			return false;
		const usuarioGuardado = Usuario.porCorreo(email);
		if (!usuarioGuardado)
			return false;
		const coincide = await usuarioGuardado.compararPassword(password);
		if (!coincide)
			return false;
		const usuarioSesion = usuarioGuardado.toJSON();
		setUsuario(usuarioSesion);
		localStorage.setItem("sesion", JSON.stringify(usuarioSesion));
		return true;
	}

	function logout() {
		setUsuario(null);
		localStorage.removeItem("sesion");
	}

	function borrarCuenta() {
		if (!usuario)
			return;
		Usuario.eliminarPorId(usuario.id);
		setUsuario(null);
		localStorage.removeItem("sesion");
	}

	function actualizarUsuario(datosActualizados) {
		if (!usuario)
			return null;
		const usuarioActualizado = Usuario.actualizarPorId(usuario.id, datosActualizados);
		if (!usuarioActualizado)
			return null;
		const sesion = usuarioActualizado.toJSON();
		setUsuario(sesion);
		localStorage.setItem("sesion", JSON.stringify(sesion));
		return sesion;
	}

	return (
		<UsuarioContext.Provider value={{ usuario, login, logout, borrarCuenta, actualizarUsuario }}>
			{children}
		</UsuarioContext.Provider>
	);
}
