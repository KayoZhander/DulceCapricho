import { useContext } from "react";
import { UsuarioContext } from "../contexts/AuthContext";

export default function Login() {
	const { login } = useContext(UsuarioContext);

	function botonLogin(event) {
		event.preventDefault();
		console.log(event);
	}

	return (<>
		<form onSubmit={botonLogin}>
			<input placeholder="Correo" type="email"></input>
			<input placeholder="Contraseña" type="password"></input>
			<button type="submit">Iniciar sesión</button>
		</form>
	</>);
}
