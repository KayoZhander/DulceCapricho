export default function Contenedor({
	plomo = false,
	children
}) {
	return (<>
		<section className="card" style={plomo ? { backgroundColor: "var(--cream-dark)" } : {}}>
			{children}
		</section>
	</>);
}
