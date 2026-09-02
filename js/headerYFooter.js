const navItems = [
	{
		id: "pagina-inicio",
		html: "index.html",
		texto: "Inicio"
	},
	{
		id: "pagina-tortas",
		html: "tortas.html",
		texto: "Tortas"
	},
	{
		id: "pagina-contacto",
		html: "contacto.html",
		texto: "Contacto"
	},
	{
		id: "pagina-carrito",
		html: "carrito.html",
		texto: "Mi carro"
	},
	{
		id: "pagina-cuenta",
		html: "login.html",
		html2: "cuenta.html",
		texto: "Iniciar sesión",
		texto2: "Mi cuenta"
	}
];

const redireccionarOMoverArriba = (ruta) => {
	if (window.location.href.includes(ruta)) {
		window.scrollTo(0, 0);
	} else {
		window.location.href = ruta;
	}
};

document.addEventListener("DOMContentLoaded", () => {
	// ----- BUILD HEADER -----
	const header = document.createElement("header");

	// Brand div
	const brandDiv = document.createElement("div");
	brandDiv.className = "brand";

	// Logo image
	const logo = document.createElement("img");
	logo.src = "../images/logo.webp";
	logo.width = 64;
	logo.height = 64;

	// Brand name span
	const brandName = document.createElement("span");
	brandName.className = "brand-name";
	brandName.textContent = "Dulce Capricho";

	brandDiv.append(logo, brandName);

	// Navigation
	const nav = document.createElement("nav");
	const ul = document.createElement("ul");

	// Navigation items (matching your exact IDs and text)
	navItems.forEach(item => {
		const li = document.createElement("li");
		const a = document.createElement("a");
		a.id = item.id;
		if (a.id === "pagina-cuenta" && localStorage.getItem("sesion")) {
			a.textContent = item.texto2;
			a.addEventListener("click", () => {
				redireccionarOMoverArriba(item.html2);
			});
		} else {
			a.textContent = item.texto;
			a.addEventListener("click", () => {
				redireccionarOMoverArriba(item.html);
			});
		}

		li.appendChild(a);
		ul.appendChild(li);
	});

	nav.appendChild(ul);
	header.append(brandDiv, nav);

	// ----- BUILD FOOTER -----
	const footer = document.createElement("footer");
	footer.id = "contacto";

	const footerBrand = document.createElement("div");
	footerBrand.className = "brand";

	const ribbon = document.createElement("span");
	ribbon.className = "ribbon";
	ribbon.textContent = "Hecho a mano, con cariño.";

	footerBrand.appendChild(ribbon);

	const footerNav = document.createElement("nav");
	// The <nav> is empty because your original had everything commented out.
	// If you need the commented <p> or <ul> later, you can uncomment them here in JS.

	footer.append(footerBrand, footerNav);

	// ----- INSERT INTO PAGE -----
	// Insert header at the very top of the body
	document.body.prepend(header);
	// Append footer at the very bottom of the body
	document.body.appendChild(footer);
});
