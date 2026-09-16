if (localStorage.getItem("sesion")) {
	window.location.href = "/cuenta.html";
}

import { Usuario, RegistroUsuarios } from "./usuarios.mjs";

const formularioLogin = document.querySelector("#login-form");
const inputPassword = document.querySelector("#password");
const btnTogglePassword = document.querySelector("#toggle-password");

btnTogglePassword.addEventListener("click", (event) => {
	event.preventDefault();
	if (inputPassword.type === "password") {
		inputPassword.type = "text";
		btnTogglePassword.textContent = "Ocultar contraseña";
	} else {
		inputPassword.type = "password";
		btnTogglePassword.textContent = "Mostrar contraseña";
	}
});

formularioLogin?.addEventListener("submit", async (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());
	const usuario = await Usuario.crear(valores);

	if (RegistroUsuarios.correoExiste(usuario.getCorreo())) {
		alert("El correo ya está registrado, por favor inicia sesión.");
		window.location.href = "/login.html";
		return;
	}
	RegistroUsuarios.agregarUsuario(usuario);

	localStorage.setItem("sesion", JSON.stringify(usuario.toJSON()));
	window.location.href = "/cuenta.html";
});
