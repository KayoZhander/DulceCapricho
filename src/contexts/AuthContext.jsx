import { createContext, useEffect, useState } from "react";

export const UsuarioContext = createContext();

export function UsuarioProvider({ children }) {
	const [usuario, setUsuario] = useState("");

	useEffect(() => {
		const nombreGuardado = localStorage.getItem("nombre");
		if (nombreGuardado) {
			setUsuario(nombreGuardado);
		}
	});

	function login(nombre) {
		setUsuario(nombre);
		localStorage.setItem("nombre", nombre);
	}

	return (<UsuarioContext.Provider value={{ usuario, login }}>
		{children}
	</UsuarioContext.Provider>);
}
