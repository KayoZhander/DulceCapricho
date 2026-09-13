// redireccionar a la pagina cuenta si ya inicío sesión
if (localStorage.getItem("sesion")) {
	window.location.href = "/cuenta.html"
}

import { Usuario, RegistroUsuarios } from "./usuarios.mjs";

const formularioLogin = document.querySelector("#login-form");
const botonOlvideCorreo = document.querySelector("#login-links-olvide-correo");

formularioLogin.addEventListener("submit", (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());

	if (!RegistroUsuarios.correoExiste(valores.email)) {
		alert("El correo no está registrado.");
		return;
	}

	localStorage.setItem("sesion", JSON.stringify(valores));
	window.location.href = "/index.html";
});

botonOlvideCorreo.addEventListener("click", (event) => {
    event.preventDefault();
    alert("ha ha");
});
