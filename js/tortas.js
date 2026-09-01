/*

<article class="card">
	<div class="photo-wrap" style="--tone-a:#5C3A2E; --tone-b:#8C5A44;">
		<img src="" alt="Torta de chocolate">
		<svg class="photo-icon" viewBox="0 0 120 120" aria-hidden="true">
		<path d="M40,72 L80,72 L74,50 L46,50 Z" fill="#FFF8EF" opacity="0.85"/>
		<path d="M46,50 Q60,30 74,50 Q60,40 46,50 Z" fill="#FFF8EF" opacity="0.85"/>
		<circle cx="60" cy="34" r="3.4" fill="#FFF8EF" opacity="0.85"/>
		</svg>
		<svg class="drip" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true">
		<path d="M0,0 H300 V6 C280,6 275,20 260,20 C245,20 240,8 225,8 C210,8 205,20 190,20 C175,20 170,8 155,8 C140,8 135,20 120,20 C105,20 100,8 85,8 C70,8 65,20 50,20 C35,20 30,8 15,8 C8,8 4,7 0,6 Z" fill="#FFF8EF"/>
		</svg>
	</div>
	<div class="card-body">
		<h3>Torta de Chocolate</h3>
		<p>Bizcocho húmedo con ganache oscuro y un toque de café.</p>
		<span class="price">$18.000</span>
	</div>
</article>

*/

// TODO: al implementar el server, remplazar los datos fijos con un import a catalogo.mjs
// porque la web no te deja importtar archivos locales por defecto
// import { CatalogoTortas } from "./catalogo.mjs";
const tortas = [
	{
		nombre: "Torta de Chocolate",
		detalle: "Bizcocho húmedo con ganache oscuro y un toque de café.",
		precio: 18000,
		imagen: null,
		tonoA: "#5C3A2E",
		tonoB: "#8C5A44",
	},
	{
		nombre: "Torta de Frutilla",
		detalle: "Crema suave con frutillas frescas y bizcocho de vainilla.",
		precio: 22000,
		imagen: null,
		tonoA: "#B34A4A",
		tonoB: "#D97A7A",
	},
	{
		nombre: "Torta de Limón",
		detalle: "Merengue italiano y relleno de crema de limón con base crujiente.",
		precio: 20000,
		imagen: null,
		tonoA: "#C2B13B",
		tonoB: "#E8D44D",
	},
	{
		nombre: "Torta de Blueberry",
		detalle: "sjdfkjasl",
		precio: 99999,
		imagen: null,
		tonoA: "#1e3f97",
		tonoB: "#6f41d8"
	}
];

const listaTortas = document.querySelector("#tortas");

tortas.forEach(t => {
	// crear tarjeta
	const tarjeta = document.createElement("article");
	tarjeta.classList.add("card");
	tarjeta.addEventListener("click", () => {
		const carro = JSON.parse(localStorage.getItem("carro") ?? "[]");
		carro.push(t);
		localStorage.setItem("carro", JSON.stringify(carro));
		alert("Torta agregada");
	});

	// fondo
	const fondoImagen = document.createElement("div");
	fondoImagen.classList.add("photo-wrap");
	fondoImagen.style.setProperty("--tone-a", t.tonoA);
	fondoImagen.style.setProperty("--tone-b", t.tonoB);

	// imagen
	const imagen = document.createElement("img");
	imagen.src = t.imagen;
	imagen.alt = t.nombre;

	// agregar imagen al contenedor
	fondoImagen.appendChild(imagen);

	// cuerpo de la tarjeta
	const cuerpoTarjeta = document.createElement("div");
	cuerpoTarjeta.classList.add("card-body");

	const titulo = document.createElement("h3");
	titulo.textContent = t.nombre;

	const descripcion = document.createElement("p");
	descripcion.textContent = t.detalle;

	const precio = document.createElement("span");
	precio.classList.add("price");
	precio.textContent = `\$${t.precio.toLocaleString()}`;

	cuerpoTarjeta.append(titulo, descripcion, precio);

	// agregar elementos a la tarjeta
	tarjeta.append(fondoImagen, cuerpoTarjeta);
	listaTortas.appendChild(tarjeta);
});
