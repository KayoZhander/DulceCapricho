const botonNavInicio = document.querySelector("#pagina-inicio");
const botonNavTortas = document.querySelector("#pagina-tortas");
const botonNavContacto = document.querySelector("#pagina-contacto");

botonNavInicio.addEventListener("click", () => {
	window.scrollTo(0, 0);
});

botonNavTortas.addEventListener("click", () => {
	window.location.href = "tortas.html";
});

botonNavContacto.addEventListener("click", () => {
	window.location.href = "contacto.html";
});
