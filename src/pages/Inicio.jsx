import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
	"/images/panes.jpg",
	"/images/pastelerias-cdmx.jpg",
	"/images/masas.jpg",
];

const INTERVALO_MS = 5000;

const PORTAFOLIO = [
	{
		clase: "grid-col-2 grid-row-2",
		img: "/images/vanguardia.jpg",
		alt: "Torta de Vanguardia",
		categoria: "Colección Exclusiva",
		titulo: "Diseño de Vanguardia",
		descripcion: "Nuestra interpretación de la pastelería artística moderna.",
	},
	{
		clase: "grid-col-2",
		img: "/images/boda.jpg",
		alt: "Torta de Bodas Minimalista",
		imgClase: "ajuste-arriba",
		categoria: "Bodas",
		titulo: "Elegancia Minimalista",
		descripcion: "Elegancia pura en cada capa.",
	},
	{
		clase: "grid-row-2",
		img: "/images/cumpleanos.jpg",
		alt: "Torta de Cumpleaños",
		categoria: "Celebraciones",
		titulo: "Colores de Fiesta",
		descripcion: "Alegría comestible para todas las edades.",
	},
	{
		clase: "",
		img: "/images/detalle.jpg",
		alt: "Detalle de Texturas",
		imgClase: "ajuste-arriba",
		titulo: "Texturas & Sabores",
	},
	{
		clase: "grid-col-2",
		img: "/images/minipastel.jpg",
		alt: "Mini Pasteles",
		categoria: "Mini Dulces",
		titulo: "El Capricho Perfecto",
	},
	{
		clase: "",
		img: "/images/evento.jpg",
		alt: "Torta de Evento",
		titulo: "Eventos Únicos",
	},
];

function HeroCarrusel() {
	const [activo, setActivo] = useState(0);

	const siguiente = useCallback(
		() => setActivo(i => (i + 1) % SLIDES.length), []
	);
	const anterior = useCallback(
		() => setActivo(i => (i - 1 + SLIDES.length) % SLIDES.length), []
	);

	// Avance automático; se reinicia cada vez que cambia el slide activo
	useEffect(() => {
		const id = setTimeout(siguiente, INTERVALO_MS);
		return () => clearTimeout(id);
	}, [activo, siguiente]);

	return (<>
		<div className="hero-carrusel">
			{SLIDES.map((src, i) => (
				<div key={src} className={"hero-slide" + (i === activo ? " activo" : "")}>
					<img src={src} alt="" />
				</div>
			))}
		</div>

		<div className="hero-inner">
			<span className="eyebrow">Reposteria artesanal</span>
			<h1>Repostería Artesanal hecha con Amor</h1>
			<p>Endulza tus momentos especiales con nuestros productos 100% frescos.</p>
			<Link to="/tortas" className="btn">Ver Catálogo</Link>
		</div>

		<button className="hero-btn hero-btn-prev" onClick={anterior} aria-label="Anterior">&#10094;</button>
		<button className="hero-btn hero-btn-next" onClick={siguiente} aria-label="Siguiente">&#10095;</button>

		<div className="hero-dots">
			{SLIDES.map((src, i) => (
				<button
					key={src}
					className={"hero-dot" + (i === activo ? " activo" : "")}
					onClick={() => setActivo(i)}
					aria-label={`Ir a la imagen ${i + 1}`}
				/>
			))}
		</div>
	</>);
}

function PortafolioItem({ clase, img, imgClase, alt, categoria, titulo, descripcion }) {
	return (
		<div className={("portafolio-item " + clase).trim()}>
			<img src={img} alt={alt} className={imgClase} />
			<div className="portafolio-text">
				{categoria && <span className="project-category">{categoria}</span>}
				<h3>{titulo}</h3>
				{descripcion && <p>{descripcion}</p>}
			</div>
		</div>
	);
}

export default function Inicio() {
	return (<>
		<section className="hero">
			<HeroCarrusel />
		</section>

		<section id="portafolio-pasteles" className="portafolio-grid">
			{PORTAFOLIO.map(item => <PortafolioItem key={item.img} {...item} />)}
		</section>
	</>);
}
