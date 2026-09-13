// redireccionar a la pagina cuenta si ya inicío sesión
if (localStorage.getItem("sesion")) {
	window.location.href = "/cuenta.html"
}

import { Usuario, RegistroUsuarios } from "./usuarios.mjs";

const formularioLogin = document.querySelector("#login-form");

formularioLogin.addEventListener("submit", async (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());
	const usuario = await Usuario.crear(valores);

	if (RegistroUsuarios.correoExiste(usuario.getCorreo())) {
		alert("El correo ya está registrado, por favor inicia sesión.");
		window.location.href = "/login.html";
		return;
	}
	RegistroUsuarios.agregarUsuario(usuario);

	localStorage.setItem("sesion", JSON.stringify(usuario));
	window.location.href = "/index.html";
});
