// redireccionar a la pagina cuenta si ya inicío sesión
if (localStorage.getItem("sesion")) {
	window.location.href = "cuenta.html"
}

const formularioLogin = document.querySelector("#login-form");

formularioLogin.addEventListener("submit", (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());

	localStorage.setItem("sesion", JSON.stringify(valores));
	window.location.href = "index.html";
});
