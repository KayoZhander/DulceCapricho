// redireccionar a la pagina login si no tiene cuenta
if (!localStorage.getItem("user")) {
	window.location.href = "login.html"
}

const botonCerrarSesion = document.querySelector("#cerrar-sesion");
botonCerrarSesion.addEventListener("click", () => {
	localStorage.removeItem("user");
	window.location.href = "index.html";
});
